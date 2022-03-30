import { Provider } from '@pongo-ui/react-provider';
import { webLightTheme } from '@pongo-ui/react-theme';
import { Switch} from '@pongo-ui/react-switch';
import { useState, useEffect} from "react";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import './scenes/UserData'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {User} from './App'
import uibuilder from 'node-red-contrib-uibuilder/front-end/src/uibuilderfe'

function Dashboard(props){
    uibuilder.start()
    props.setUser(props.user)
    const [lock, setLock] = useState(false);
    const [user_captcha_value,setUserCaptcha] =useState("");
    const [captchaDone, setCaptchaDone] = useState(false);
    const [captchaError, setCaptchaError] = useState("");
   // const [email, setEmail] = useState("");
    // const [answerError, setAnswerError] = useState("");
     const [answerSubmitted, setAnswerSubmitted] = useState(false);
    // const [code, setCode] = useState("");
    // const [userCode, setUserCode] = useState("");
    const [answerError, setAnswerError] = useState("");
    const [answerTries, setAnswerTries] = useState(0);
    const [noderedToggle, setNoderedToggle] = useState(false);
    const numberOfTries = 2;
    const [beltStatus, setBeltStatus] = useState("");
    const [beltControl, setBeltControl] = useState("");
    const [nodeMsgRecv, setNodeMsgRecv] = useState(undefined);
    const [nodeMsgSent, setNodeMsgSent] = useState(undefined);
    const [answer, setAnswer] = useState("");
    const [socket, setSocket]= useState(undefined);


    useEffect(() => {
        loadCaptchaEnginge(6);
    },[]);

    // useEffect(() => {
    //     if(code !==""){
    //         sendMessage(code,code);
    //     }
    // },[code]);


    useEffect(() => {
        if(nodeMsgRecv !==undefined){
            console.log("hello msgrecv")
            if(nodeMsgRecv['topic'] === "beltStatus"){
                setBeltStatus(nodeMsgRecv['payload']);
            }
            else{
                setBeltStatus(nodeMsgRecv['payload']);
            }
        }
    },[nodeMsgRecv]);

    uibuilder.onChange('sentMsg', function(newVal) {
        console.info('[uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal);

        setNodeMsgSent(newVal);
    })

    uibuilder.onChange('msg', function(msg){
        console.info('[uibuilder.onChange] property msg changed!', msg)
        setNodeMsgRecv(msg);
    })

    // uibuilder.onChange('ioConnected', (newVal) => {
    //     console.info('[uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)

    //     setSocket({ 'socketConnectedState': newVal })
    // })


    function sendMessage(topic, payload) {
        console.info('Sending a message to Node-red')
        let msg = uibuilder.send({'topic':topic,'payload':payload})
        setNodeMsgSent(msg);
    }
    



    function switchOnChange(){
        setLock(!lock)
    }

    function doCaptchaSubmit(){
        if (validateCaptcha(user_captcha_value, false)===true) {
            setCaptchaDone(true);
            setCaptchaError("");
        }
        else {
            loadCaptchaEnginge(6);
            setCaptchaError("Error: Wrong Captcha try again")
            setCaptchaDone(false);
        }

    };

    function validateAnswer(){
        return answer.length > 0;
    }

    function handleAnswerSubmit(){

        if(answer === props.user.secAnswer){
            setBeltControl(true)
            sendMessage("beltControl", "true")
        }
        else{
            setAnswerError("Wrong answer, number of tries left:"+(numberOfTries - answerTries).toString())
            setAnswerTries(answerTries+1);
        }

        return
    }



    function renderSwitch (){
        return (<div> 
                    <h5>Toggle belt lock:
                    {/* <Provider theme={webLightTheme}>
                    <Switch defaultChecked={false} onChange={switchOnChange} />
                    </Provider> */}
                    <label class="switch">
                    <input type="checkbox" onChange={switchOnChange}/>
                    <span class="slider"></span>
                    </label></h5>
                </div>);
    }

    function renderCaptcha(){ 
        return( <div>
                    <h5>Please complete captcha to prove humanity:</h5>
                    <LoadCanvasTemplateNoReload />
                    <input placeholder="Enter Captcha Value" value={user_captcha_value} id="user_captcha_input" name="user_captcha_input" type="text" onChange={(e) => setUserCaptcha(e.target.value)} ></input>
                    <button  onClick={() => doCaptchaSubmit()}>Submit</button>
                    {captchaError===("") ?("") :(<p>{" "}{captchaError}</p>)}
                </div>)
    }

        function renderSecurityQuestion(){
        return(
            <div>
        <p> {" "}{props.user.seqQuestion}</p>
        <Form onSubmit={handleAnswerSubmit}>
        <Form.Group controlId="Answer">
          <Form.Label>Answer:</Form.Label>
          <Form.Control
            autoFocus
            type="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}/>
           {answerError===("") ?(""): (<p>{" "}{answerError}</p>) }
        </Form.Group>
        <Button  size="lg" type="submit" disabled={!validateAnswer()}>
          Submit
        </Button>
      </Form>

            </div>)
    }

    function renderNodeBtn(){
        return (
            <div>
        <button onClick={() => setNoderedToggle(!noderedToggle)} >
        Toogle Node-red message info
    </button>
    </div>);
    }

    function renderNoderedInfo(){
		return(
// <div ref="root" style={{height:"50vh"}}>
            <div>    

                    <div >
                        <div>Last msg Received:</div>
                        <pre><code>{JSON.stringify(nodeMsgRecv, null, 2)}</code></pre>
                        {/* <div># Msgs Received: {nodeMsgRecv}</div> */}
                    </div>

                    <div >
                        <div>last Msg Sent</div>
                        <pre><code>{JSON.stringify(nodeMsgSent, null, 2)}</code></pre>
                        {/* <div># msgs Sent: {nodeMsgSent}</div> */}
                    </div>

                    <div >
                        <div>Socket Connected?: {socket}</div>
                    </div>

                </div>
		);

	}




    return(
    <div className='App'> 
        <div className='App-header'>
            <h1>Chindogu Belt Dashboard of {props.user.username} </h1>
        </div>
        <b/>
        <p>Current belt status:{beltStatus===("") ?(""): (<p>{" "}{beltStatus}</p>) }</p>{captchaDone===false ? (""): renderSwitch()}
        {captchaDone===true ? (""): renderCaptcha()}
        <b/>
        {lock === true && answerSubmitted===false ? renderSecurityQuestion() : ("")}
        <b/>
        
        {captchaDone === true ? renderNodeBtn() : ("")}
        {noderedToggle === true ? renderNoderedInfo()   : ("")}
    </div>
   
    );  
}


export default Dashboard 




















    // function handleEmailSubmit(){
    //     if(email.length > 5 && email.includes("@") && email.includes(".")){
    //         setEmailSubmitted(true);
    //         setCode((Math.floor(100000 + Math.random() * 900000)).toString());
    //         console.log(code)
    //         sendMessage("email",email)
    //     }
    //     else{
    //         setEmailError("Wrong email format");
    //     }
    // }


    // function handleCode(){
    //     if(userCode.length === 6 && /^\d+$/.test(userCode)){
    //         if(userCode === code){
    //             sendMessage("beltControl", "true")
    //         }
    //         else{
    //             setCodeError("Wrong code, number of tries left:"+(numberOfTries - codeTries).toString())
    //             setCodeTries(codeTries+1);
    //         }
    //     }
    // }





    // function validateEmail() {
    //     return email.length > 5 && email.includes("@") && email.includes(".");
    //   }
    // function validateCode(){
    //     return userCode.length === 6 && /^\d+$/.test(userCode);
    // }



    // function renderEmail(){
    //     return(
    //         <div>
    //     <Form onSubmit={handleEmailSubmit}>
    //     <Form.Group controlId="Email">
    //       <Form.Label>Email:</Form.Label>
    //       <Form.Control
    //         autoFocus
    //         type="Email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}/>
    //        {emailError===("") ?(""): (<p>{" "}{emailError}</p>) }
    //     </Form.Group>
    //     <Button  size="lg" type="submit" disabled={!validateEmail()}>
    //       Submit
    //     </Button>
    //   </Form>

    //         </div>)
    // }

        // function renderCodeSubmit(){
    //     return(
    //         <div>
    //     <Form onSubmit={handleCode}>
    //     <Form.Group controlId="Code">
    //       <Form.Label>Code:</Form.Label>
    //       <Form.Control
    //         autoFocus
    //         type="Code"
    //         value={userCode}
    //         onChange={(e) => setUserCode(e.target.value)}/>
    //        {codeError===("") ?(""): (<p>{" "}{emailError}</p>) }
    //     </Form.Group>
    //     <Button  size="lg" type="submit" disabled={!validateCode()}>
    //       Submit
    //     </Button>
    //   </Form>
    //     </div>)
    // }
    