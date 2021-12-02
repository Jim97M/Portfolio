import React from 'react'
import styled from 'styled-components';
import TwitterIcon from '@material-ui/icons/Twitter';
import GithubIcon from '@material-ui/icons/GitHub';
//import YoutubeIcon from '@material-ui/icons/YouTube';
import { mdiBitbucket } from '@mdi/js'; 
import Icon from '@mdi/react'
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Particle from '../Components/Particle';

function HomePage() {
    return (
        <HomePageStyled>
            <div className="particle-con">
                <Particle />
            </div>
            <div className="typography">
                <h1>Hi, I'm <span>James Masika Wabuya</span></h1>
                <p>
                   I'm a 24year old Software Developer 
                </p>
                <div className="icons">
                  <a href="https://www.linkedin.com/in/wabuya-james-323a9121a/" className="icon">
                        <LinkedInIcon />
                  </a>
                    <a href="ff" className="icon">
                        <TwitterIcon />
                    </a>
                    <a href="https://github.com/Jim97M/" className="icon i-bucket">
                        <GithubIcon />
                    </a>
                    <a href="https://bitbucket.org/Jim97/" className="icon i-github">
                    <Icon path={mdiBitbucket}
                       size={1}
                       horizontal
                       vertical
                       rotate={90}
                       color="red"
                       spin/>
                 </a>
                </div>
            </div>
        </HomePageStyled>
    )
}

const HomePageStyled = styled.header`
    width: 100%;
    height: 100vh;
    position: relative;
   
    .typography{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 80%;

        .icons{
            display: flex;
            justify-content: center;
            margin-top: 1rem;
            .icon{
                border: 2px solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all .4s ease-in-out;
                cursor: pointer;
                &:hover{
                    border: 2px solid var(--primary-color);
                    color: var(--primary-color);
                }
                &:not(:last-child){
                    margin-right: 1rem;
                }
                svg{
                    margin: .5rem;
                }
            }

            .i-youtube{
                &:hover{
                    border: 2px solid red;
                    color: red;
                }
            }
            .i-github{
                &:hover{
                    border: 2px solid #5F4687;
                    color: #5F4687;
                }
            }
        }
    }
`;

export default HomePage;
