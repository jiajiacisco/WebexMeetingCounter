#!/usr/bin/env python3
"""
Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
"""

__author__ = "Jiade Lian <jiadlian@cisco.com>"
__copyright__ = "Copyright (c) 2023 Cisco and/or its affiliates."
__license__ = "Cisco Sample Code License, Version 1.1"


import pandas as pd
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta 
from webexteamssdk import WebexTeamsAPI
import requests
import re
import tldextract 
from flask import Flask,request,jsonify,make_response


# Global Flask flask_app
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

"""
#Helper functions
"""
def isValidToken(TOKEN):

    headers = { "Content-Type": "application/json" ,
                'Authorization': f'Bearer {TOKEN}'
            }
    URL = "https://webexapis.com/v1/roles"
    PARAMS = {

             }
    r = requests.get(url = URL, params = PARAMS,headers=headers)
    data = r.json()
    print(data)  
    try:
        if "The request requires a valid access token" in data['errors'][0]['description']:
            return "Failure"
        else:
            return "Success"
    except:
        return "Success"

"""
https://developer.webex.com/docs/api/v1/meetings/list-meetings
"""
def getWebexMeeting(startTime,endTime,email,TOKEN):
    api = WebexTeamsAPI(TOKEN)
    meetingDataAll = api.meetings.list(from_=startTime,to=endTime,hostEmail=email)
    return meetingDataAll



def getMeetingParticipant(meetingId,TOKEN,email):
    headers = { "Content-Type": "application/json" ,
                'Authorization': f'Bearer {TOKEN}'
            }
    URL = "https://webexapis.com/v1/meetingParticipants"
    max_ = "20"
    print(meetingId)
    print(TOKEN)
    print(email)
    PARAMS = {
              'meetingId':meetingId,
              'hostEmail' :email
             }
    r = requests.get(url = URL, params = PARAMS,headers=headers)
    data = r.json()
    print(data)
    print("partcipant data________________")
    return data

"""
API Endpoints 
"""
@app.route('/', methods=['POST'])
def homePage():
    jsonData = json.loads(request.data)
    TOKEN = jsonData["token"]
    print(TOKEN)
    result = isValidToken(TOKEN)
    print(result)
    if result == "Failure":
        data = {'message': 'API_KEY is invalid', 'code': 'Failure'}
        return make_response(jsonify(data), 401)
    else:
        data = {'message': 'API_KEY is valid', 'code': 'Success'}
        print("login success")
        return make_response(jsonify(data), 201)



@app.route('/meetingdata', methods=['GET'])
def getMeetingData():
    TOKEN = request.args.get('Token')
    startDateTime = request.args.get('start')
    endDateTime = request.args.get('end')
    emailData = request.args.get('email')

    print(startDateTime)
    print(endDateTime)
    print(emailData)

    responseData = []
    meetingDataDetails = dict()
    emailData = json.loads(emailData)


    """
    Singapore Time to UTC Conversion
    """
    startDateTime = datetime.strptime(startDateTime,"%Y-%m-%dT%H:%M") - timedelta(hours=8)
    startDateTime  = datetime.strftime(startDateTime,"%Y-%m-%dT%H:%M") + ":00Z"
    endDateTime = datetime.strptime(endDateTime,"%Y-%m-%dT%H:%M") - timedelta(hours=8) 
    endDateTime = datetime.strftime(endDateTime,"%Y-%m-%dT%H:%M") + ":00Z" 

    for data in emailData:
        print(data)
        email = data['email'] 
        print(email)
        if not email:
            continue
        meetingDataAll = getWebexMeeting(startDateTime,endDateTime,email,TOKEN)
        nonrecurMeetingIds = []
        recurMeetingIds = []
        
        try:
            for meetingData in meetingDataAll:
                print(meetingData)
                print("_______________________")
                if meetingData.recurrence is None:
                    meetingStart = datetime.strptime(meetingData.start,"%Y-%m-%dT%H:%M:%SZ")+ timedelta(hours=8)
                    meetingEnd =  datetime.strptime(meetingData.end,"%Y-%m-%dT%H:%M:%SZ")+ timedelta(hours=8)
                    meetingStart = meetingStart.strftime("%Y-%m-%d %H:%M %p")
                    meetingEnd = meetingEnd.strftime("%Y-%m-%d %H:%M %p")
                    nonrecurMeetingIds.append( 
                                           {"meetingId":meetingData.id,
                                           "meetingTitle":meetingData.title,
                                           "meetingStart": meetingStart,
                                           "meetingEnd": meetingEnd,
                                           "hostEmail": meetingData.hostEmail
                                           }
                                        )
        except:
            print("The API token does not have full accesss")
            continue
        
        
        internalDomain = tldextract.extract(email).domain + tldextract.extract(email).suffix
        externalMeetingCounter = 0 
        totalTimeSpent = 0
        totalExternalPaticipant = 0
        topMeetingEmail = 0
        nonrecurMeetingIdsExternal = []

        for i in range(len(nonrecurMeetingIds)):
            externalEmailSet = set()            
            externalEmailData = []
            meetingTimeSpent = 0
            externalParticipant = 0
            meetingParticipantsData  = getMeetingParticipant(nonrecurMeetingIds[i]['meetingId'],TOKEN,nonrecurMeetingIds[i]['hostEmail'])
            print(meetingParticipantsData)
            if len(meetingParticipantsData)==0:
                print("Null Meeting #106")
                continue
            print(meetingParticipantsData)
            try:
                meetingParticipantsDataItems = meetingParticipantsData['items']
            except:
                continue

            #skip meetings where no one join or participant is one only
            if meetingParticipantsDataItems is None or len(meetingParticipantsDataItems) == 1:
                print("Null Meeting #119") 
                continue
            for meetingParticipants in meetingParticipantsDataItems:
                participantEmail = meetingParticipants['email']
                participantDomain = tldextract.extract(participantEmail).domain + tldextract.extract(email).suffix
                if participantEmail==email:
                    for device in meetingParticipants["devices"]:
                        print(meetingParticipants["devices"])
                        print("_______")
                        try:
                            meetingTimeSpent = max(device['durationSecond'],meetingTimeSpent)
                        except:
                            continue
                if participantEmail!=email and participantDomain!=internalDomain:
                    externalEmailSet.add(participantEmail)
                    if len(externalEmailData)!=5:
                        externalEmailData.append(participantEmail)

            if len(externalEmailSet)>0:
                externalMeetingCounter+=1
                totalTimeSpent += (meetingTimeSpent/60)
                totalExternalPaticipant += len(externalEmailSet)
                nonrecurMeetingIds[i]["totalTimeSpent"] = round(meetingTimeSpent/60,2)
                nonrecurMeetingIds[i]["externalParticipants"] = len(externalEmailSet)
                nonrecurMeetingIds[i]["externalParticipantsEmail"] = ', '.join(externalEmailData)
                nonrecurMeetingIdsExternal.append(nonrecurMeetingIds[i]) 


        data = { "userMail":email,
            "externalMeetingCount":externalMeetingCounter,
            "totalTime":round(totalTimeSpent,2),
            "avgTimePerMeeting":0 if externalMeetingCounter==0 else round(totalTimeSpent/externalMeetingCounter,2),
            "avgParticipantCount": 0 if externalMeetingCounter==0 else totalExternalPaticipant/externalMeetingCounter 
             } 
        responseData.append(data)
        print(nonrecurMeetingIdsExternal)
        meetingDataDetails[email] = nonrecurMeetingIdsExternal

    payload = {}
    payload['meetingData'] = responseData
    print(meetingDataDetails)
    payload.update(meetingDataDetails)
    print(payload)
    return make_response(jsonify(payload), 200)


if __name__ == "__main__":
    app.run(port=5001)






