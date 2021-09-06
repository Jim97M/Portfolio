// import LocationOnIcon from '@material-ui/icons/LocationOn';


// // import {sendMail} from "../helpers/Mail";
import React, { useState } from 'react';
import '../index.css';
import styled from 'styled-components';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import SubjectIcon from '@material-ui/icons/Subject';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ContactItem from '../Components/ContactItem';
import {MainLayout, InnerLayout} from '../styles/Layouts';
import Title from '../Components/Title';
import ReactQuill from 'react-quill-2';
import 'react-quill-2/dist/quill.snow.css'; // ES6
import axios from 'axios';
import sending from '../img/mail.gif';
// import GoogleMaps from '../Components/GoogleMaps';


function App() {

    const Form = () => {
     const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [subject, setSubject] = useState('')
    const[loading, setLoading] = useState(false)
  
    const handleQuillChange = (value) => {
      setMessage(value)
    }
  
    const handleRequest = async (e) => {
      if(email && name && subject !== ""){
        if(message !== ""){
        e.preventDefault()
      setLoading(true)
      console.log({email, message, name, subject})
  
      const body = {
        email,
        message, 
        subject, 
        name
      }
  
     await axios.post('', body, {
        headers: {
          'Content-type': 'application/json'
        }
      }).then((res) => {
        alert('Email Sent Successfully')
        setLoading(false)
        console.log(res)
        window.location.reload()
      }).catch((err) => {
        console.log(err)
        setLoading(false)
      })
        } else {
          alert('Compose Email')
        }
        
      } else {
        alert('Please fill all required filled')
      }
      
  
      // const response = await fetch("/mail", {
      //   method: 'POST',
      //   headers: {
      //     'Content-type': 'application/json'
      //   },
  
      //   body: JSON.stringify({
      //     email,
      //     message,
      //     subject,
      //     name,
      //     company
      //   })
      // })
  
      // const data = await response.json()
      // if(data.status === 'success'){
      //   alert('Message Sent.')
      //   this.resetForm()
      // }
      // else if(data.status === 'fail'){
      //   alert('Message failed to send')
      // }
    }
      // const = <PhoneIcon/>
      const Uemail = <EmailIcon />
      const location = <LocationOnIcon />
      return (
        <MainLayout>
        <Title title={'Contact'} span={'Contact'} />
        <ContactPageStyled>
        <InnerLayout className={'contact-section'}>
        <form onSubmit = {handleRequest} method = "post">
        <div className = "form">
          <div className = "form__wrapper">
            <div className = "form__title">
            <h4>{loading ? 'Sending...' : "Send Email"}</h4>
            {
            loading && <img 
              src = {sending}
              alt = "loading..."
              style = {{
                filter: "invert(1)",
                position: "absolute",
                width : 200,
                height : 200,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
          }
          </div>
          <div className = "form__container">
            <div className = "form__containerItems">
              <div className = "form__containerItem">
                <div className = "form__containerItemName">
                <label>Name</label>
                <PersonIcon />
              </div>
              <div className = "form__containerItemField">
                <input
                  id = "name"
                  value = {name}
                  onChange = {(e) => setName(e.target.value)}
                  required = {true} 
                  type = "text"
                  placeholder = "Enter Your Name"
                />
              </div>
              </div>
              <div className = "form__containerItem">
                <div className = "form__containerItemName">
                <label>Email</label>
                <EmailIcon />
              </div>
              <div className = "form__containerItemField">
                <input 
                  id = "email"
                  value = {email}
                  onChange = {(e) => setEmail(e.target.value)}
                  required = {true}
                  type = "text"
                  placeholder = "Enter Your valid Email"
                />
              </div>
              </div>
              <div className = "form__containerItem">
                <div className = "form__containerItemName">
                <label>Subject</label>
                <SubjectIcon />
              </div>
              <div className = "form__containerItemField">
                <input
                  id = "subject"
                  value = {subject}
                  onChange = {(e) => setSubject(e.target.value)} 
                  required
                  type = "text"
                  placeholder = "Add Subject"
                />
              </div>
            </div>
            <div className = "form__containerItem">
              <div className = "form__containerItemName">
                <label>Compose Mail</label>
                <button
                disabled = {loading}
                onClick = {handleRequest}  type = "submit" className = "btn btn-success">Send</button>
              </div></div>
              <div className = "container__composeMail">
              <ReactQuill
                id = "message"
                value = {message}
                onChange = {handleQuillChange}
                className = "quill" 
                placeholder = "Enter Content from here..."
              />
            </div>
            
          </div> 
          {/* <GoogleMaps /> */}
        
      </div>
      
     </div>
     
   </div>
  </form>
  <div className="right-content">
      {/* <ContactItem title={'Phone'} icon={phone} cont1={'+66-789675637'} cont2={'07663520283'} /> */}
       <ContactItem title={'Location'} icon={location} cont1={'Map'} cont2={'Map'} />
       <ContactItem title={'Address'} icon={location} cont1={'Kasarani, Nairobi, Kenya'} cont2={'Kenya'} />
                    
</div>
</InnerLayout>
  </ContactPageStyled>
  </MainLayout>


  )}
  
    return (
      <div className="App">
        <>
        <Form />
        </>
        
      </div>
    );
  }

  

//      //Onstate change in input fields
//     //  const handleChange = name => event => {
//     //     setValues({...values, [name]: event.target.value});
//     // }

//     return (
//         <MainLayout>
//             <Title title={'Contact'} span={'Contact'} />
//             <ContactPageStyled >        
//                 <div className="left-content">
//                     <div className="contact-title">
//                         <h4>Get In Touch</h4>
//                     </div>
//                     <form  className="form" onSubmit={handleRequest}>
//                         <div className="form-field">
//                             <label htmlFor="name"  >Enter your name*</label>
//                             <input type="text" 
//                                name="name"
//                                value={name}
//                                onChange = {(e) => setName(e.target.value)}
//                                id="name" />
//                         </div>
//                         <div className="form-field">
//                             <label htmlFor="email"  >Enter your email*</label>
//                             <input type="email"
//                               onChange={(e) => setEmail(e.target.value)}
//                               name="email"
//                               value={email}
                            
//                              id="email" />
//                         </div>
//                         <div className="form-field">
//                             <label htmlFor="subject"  >Enter your subject</label>
//                             <input type="text"
//                              name="subject"
//                              onChange={(e) => setSubject(e.target.value)}
//                              value={subject}
//                              id="subject" />
//                         </div>
//                         {/* <div className="form-field">
//                             <label htmlFor="text-area">Enter your Message*</label>
//                             <textarea
//                              name="message"
//                             onChange={(e) => setMessage(e.target.message)}
//                             value={message}
//                             id="textarea" cols="30" rows="10"></textarea>
//                         </div> */}
//                         <div className="form-field f-button">
//                             <PrimaryButton 
//                               disabled= {loading}
//                              type = "submit"
//                               onClick = {handleRequest}
//                             title={'Send Email'} />
//                         </div>
//                         <ReactQuill 
//                            id = "message"
//                            value = {message}
//                            onChange = {handleQuillChange}
//                            className = "quill"
//                            placeholder = "Enter Content from here..."
//                         />
//                     </form>
//                 </div>
//              
//             </InnerLayout>
//             </ContactPageStyled>
//         </MainLayout>
//     )
// };

// return (
//     <div>
//       <>
//        <Form />
//       </>
//     </div>
// )
// }
 const ContactPageStyled = styled.section`
    .contact-section{
         display: grid;
        grid-template-columns: repeat(2, 1fr);
       grid-column-gap: 2rem;
       @media screen and (max-width: 978px){
            grid-template-columns: repeat(1, 1fr);
                         .f-button{
              margin-bottom: 3rem;
           }
        }
       .right-content{
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            @media screen and (max-width: 502px){
               width: 70%;
            }
        }
        .contact-title{
            h4{
                color: var(--white-color);
                padding: 1rem 0;
               font-size: 1.8rem;
            }
         }
                 .form{
            width: 100%;
            @media screen and (max-width: 502px){
               width: 100%;
           }
            .form-field{
              margin-top: 2rem;
                position: relative;
                 width: 100%;
               label{
                   position: absolute;
                     left: 20px;
                     top: -19px;
                    display: inline-block;
                   background-color: var(--background-dark-color);
                    padding:0 .5rem;
                    color: inherit;
               }
               input{
                    border: 1px solid var(--border-color);
                    outline: none;
                   background: transparent;
                    height: 50px;
                   padding:0 15px;
                   width: 100%;
                    color: inherit;
                }
              textarea{
                   background-color: transparent;
                  border: 1px solid var(--border-color);
                  outline: none;
                   color: inherit;
                   width: 100%;
                  padding: .8rem 1rem;
              }
         }

            
      }
    }
`;


 export default App;
