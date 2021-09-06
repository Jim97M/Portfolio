import React,{useEffect, useState} from 'react'
import styled from 'styled-components';
import axios from 'axios';
import {InnerLayout} from '../styles/Layouts';
import Title from '../Components/Title';
import ReviewItem from '../Components/ReviewItem';

function ReviewsSetion() {

    const [review, setReviews] = useState([])
    const getData = async() => {
        const res = await axios.get('/api/review')
        setReviews(res.data);
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <ReviewsStyled>
            <Title title={'Reviews'} span={'Reviews'} />
            <InnerLayout>
                <div className="reviews">
                    <ReviewItem 
                        text={review.map(u => <h3 key={u._id}>{u.name}</h3>)} 
                    />
                    <ReviewItem 
                        text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt culpa ad itaque quas? Dos ir por culpa ad itaque quas!'} 
                    />
                    
                </div>
            </InnerLayout>
        </ReviewsStyled>
    )
}

const ReviewsStyled = styled.section`
    .reviews{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1.5rem;
        width: 100%;
        @media screen and (max-width:650px){
            grid-template-columns: repeat(1, 1fr);
        }
    }
`;

export default ReviewsSetion;
