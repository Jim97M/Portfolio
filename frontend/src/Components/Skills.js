import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import {InnerLayout} from '../styles/Layouts';
import Title from '../Components/Title';
import ProgressBar from './ProgressBar';
import axios from 'axios';

function Skills() {

    const [skill, setSkills] = useState([])
    const getSkills =  async() => {
        const res = await axios.get('/api/skill');
        setSkills(res.data)
    }

    useEffect(() => {
        getSkills()
    })

    return (
        <SkillsStyled>
            
                <Title title={'My Skills'} span={'my skills'} />
                
                <InnerLayout>
                    <div className="skills">
                    {skill.map((skill) => (
                        <ProgressBar 
                            key={skill._id}
                            title={skill.title}
                            width={skill.width}
                            text={skill.text}
                        />
                        ))}
                        {/* <ProgressBar 
                            title={'CSS3'}
                            width={'90%'}
                            text={'90%'}
                        />
                        <ProgressBar 
                            title={'JAVASCRIPT'}
                            width={'85%'}
                            text={'85%'}
                        />
                        <ProgressBar 
                            title={'JAVA'}
                            width={'60%'}
                            text={'60%'}
                        />
                        <ProgressBar 
                            title={'PYTHON'}
                            width={'95%'}
                            text={'95%'}
                        />
                        <ProgressBar 
                            title={'React JS'}
                            width={'75%'}
                            text={'75%'}
                        />
                        <ProgressBar 
                            title={'UNITY'}
                            width={'75%'}
                            text={'75%'}
                        /> */}
                    </div>
                   
                </InnerLayout>
                 
        </SkillsStyled>
    )
}

const SkillsStyled = styled.section`
    .skills{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-row-gap: 2rem;
        grid-column-gap: 3rem;
        @media screen and (max-width: 700px){
            grid-template-columns: repeat(1, 1fr);
        }
    }
`;

export default Skills;
