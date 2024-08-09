import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm(){
    const [isLoading, setIsLoading] = useState(false);
    const [tweet, SetTweet] = useState("");
    const [file, setFile]  = useState <File | null>(null);
    const MaxSize = 10*1024*1204 ;
    const onChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        SetTweet(e.target.value);
    };
    const onFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files &&  files[0].size > MaxSize){
            alert("업로드하는 파일이 10MB가 넘습니다." )
                return;
        }
        if(files && files.length === 1){
            setFile(files[0]);
        }
    };
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        const user = auth.currentUser;
        e.preventDefault();
        if(!user || isLoading || tweet == "" || tweet.length > 180) return;

        try{
            setIsLoading(true);
            const doc = await addDoc(collection(db,"tweets"),{
                tweet,
                CreateAt:Date.now(),
                username : user.displayName || "익명의 사용자",
                userId : user.uid,
            });
            if(file){
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef,file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc,
                    {
                        photo:url,
                    });
            }
            SetTweet("");
            setFile(null);
        }catch(e){
            console.log(e);
        }finally{
            setIsLoading(false);
        }
    }
    return (
    <Form onSubmit={onSubmit}>
    <TextArea 
    required
    rows={5} maxLength="180" onChange={onChange} value={tweet} placeholder="무슨일이 있었나요?"/>
    <AttachFileButton htmlFor="file">{file?"사진 추가 완료" :"사진 추가"}</AttachFileButton>
    <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*"/>
    <SubmitBtn type="submit" value={isLoading ? "보내는 중....." : "트윗 보내기"}/>
    </Form>
    )
}