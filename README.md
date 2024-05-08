# Webex External Meeting Tracker (Webex Eyes)

**Background:** <br/> For some companies and job roles, it might be useful to have some visbility into how many external meetings the user is having for job performace monitoring reasons or security purposes 
<br/>

**Definition:**
- An external meeting is defined as a meeting where at least one meeting participant has a different email domain from the user of the organisation <br/>
For this project, users with email `@gmal.com` domain represent internal users. All other emails that dont use the `@gmail.com` domain will be classified as external users

**Product Description:** <br/>
WebexEyes makes use of WebexMeetings API to create a dashboard that provides great visbility into all external meetings users have attended <br/>

**Use Cases:** 
1. **Sales Performance Tracking** Sales Managers can use this tool to monitor their salesforce and ensure they are scheduling meetings with clients to meet their sales commit or monitor the progress of an ongoing sales transaction. The statistical data could also be used for job KPI tracking purposes
2. **Corporate Security** Verify if an external meeting a user in an organisation has attedned is job-related or something suspicious
   
**Product Overview**<br/>
1. **Login Page:<space>** Enter your Webex Admin API Token that is obtainable from Webex Control Hub <br/>
![App Interface Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p1.png)
2. **Query Page:<space>** Select the time period and input the user emails you wish to query <br/>
![App Interface Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p2.png)
3. **Query Page:<space>** Select the time period and drop a CSV file containing user emails you wish to query <br/>
![App Interface Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p3.png)
4. **External Meetings Overview:<space>** Display the high-level external meeting data of each user. To view the specific meeting details click on the link <br/>
![App Interface Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p4.png)
5. **External Meetings Details:<space>** View specific details of each meeting <br/>
![App Interface Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p5.png)
5. **Built-in Search Functionality:<space>** Search and filter the data accordingly. Could be based on email, title and date <br/>
![App Interface Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p6.png)

# App Design <br />
![Overall Block Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p7.png)
![Overall Block Diagram](https://github.com/jiajiacisco/WebexMeetingCounter/blob/main/images/p8.png)

**Technolgies Used:** 
Webex ControlHub, WebexMeetings API, ReactJS, Python, Flask
