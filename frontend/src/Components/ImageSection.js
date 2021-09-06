import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import PrimaryButton from './PrimaryButton';
import axios from 'axios';
import resume from '../img/IMG-20210524-WA0001.jpg';


function ImageSection() {

    const [profile, setProfile] = useState([]);
    const getData = async()=>{
        const res = await axios.get('/api/profile');
        setProfile(res.data);
    }

    useEffect(() => {
            getData()
    }, [])

    return (
        <div>
            {profile.map((profile) => (
        <ImageSectionStyled key={profile._id}>
            <div className="left-content">
                <img src={resume} alt=""/>
            </div>
            <div className="right-content">
                <h4> {profile.title} </h4>
                <p className="paragraph">
                  {profile.description}
                </p>
                <div className="about-info">
                    <div className="info-title">
                        <p>Full Name</p>
                        <p>Age</p>
                        <p>Nationality </p>
                        <p>Languages </p>
                        <p>Location</p>
                        <p>Service</p>
                    </div>
                    <div className="info">
                        <p>: {profile.name}</p>
                        <p>: {profile.age}</p>
                        <p>: {profile.nationality}</p>
                        <p>: {profile.language}</p>
                        <p>: {profile.location}</p>
                        <p>: {profile.spec}</p>
                    </div>
                </div>
                <PrimaryButton title={'Download Cv'} />
            </div>
        </ImageSectionStyled>
        ))}
        </div>
    )
}


const ImageSectionStyled = styled.div`
    margin-top: 5rem;
    display: flex;
    @media screen and (max-width:1000px){
        flex-direction: column;
        .left-content{
            margin-bottom: 2rem;
        }
    }
    .left-content{
        width: 100%;
        img{
            width: 95%;
            object-fit: cover;
        }
    }
    .right-content{
        width: 100%;
        h4{
            font-size: 2rem;
            color: var(--white-color);
            span{
                font-size: 2rem;
            }
        }
        .paragraph{
            padding: 1rem 0;
        }
        .about-info{
            display: flex;
            padding-bottom: 1.4rem;
            .info-title{
                padding-right: 3rem;
                p{
                    font-weight: 600;
                }
            }
            .info-title, .info{
                p{
                    padding: .3rem 0;
                }
            }
        }
    }
`;
export default ImageSection;
