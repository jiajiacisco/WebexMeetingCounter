import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    button: {
        margin: theme.spacing(1),
        backgroundColor:"#00bcf5",
        color: "whitesmoke"
      },
      textFieldEmail:{
        marginLeft: 'auto',
        marginRight: 'auto',            
        paddingBottom: "30px",
        marginTop: 0,
        fontWeight: 500,
        paddingLeft:"20px"
      },
    root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(0),
        },
        '& label': {
            color: 'white',
          },
        '& label.Mui-focused': {
            color: 'white',
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: ' #00bcf5',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: '#00bcf5',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00bcf5',
            },
          },
      },

      
  }))

  export default useStyles;