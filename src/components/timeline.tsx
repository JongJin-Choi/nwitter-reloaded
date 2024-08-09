import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";


export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    CreateAt: number;
  }
  
  const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    `;
  
  export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("CreateAt", "desc")
      );
    //   const spanshot = await getDocs(tweetsQuery);
    //   const tweets = spanshot.docs.map((doc) => {
    //     const { tweet, CreateAt, userId, username, photo } = doc.data();
    //     return {
    //       tweet,
    //       CreateAt,
    //       userId,
    //       username,
    //       photo,
    //       id: doc.id,
    //     };
    //   });
     await onSnapshot(tweetsQuery,(snapshot)=>{
       const tweets  = snapshot.docs.map((doc)=>{
            const { tweet, CreateAt, userId, username, photo } = doc.data();
        return {
          tweet,
          CreateAt,
          userId,
          username,
          photo,
          id: doc.id,
     };
     });
      setTweet(tweets);
    });
    }
    useEffect(() => {
      fetchTweets();
    }, []);


return <Wrapper>
{tweets.map((tweet) =>(
    <Tweet key={tweet.id} {...tweet}/>
))}
</Wrapper>
    }
