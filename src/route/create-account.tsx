import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
    height : 100%;
    display : flex;
    flex-direction : column;
    align-items : center;
    width : 420px;
    padding : 50px 0px;
`;

const Title =  styled.h1`
    font-size : 42px;
`;

const Form = styled.form`
    margin-top: 50px;
    display : flex;
    flex-direction : column;
    gap : 10px;
    width: 100%;

`;

const Input = styled.input`
    padding : 10px 20px;
    border-radius : 50px;
    border : none;
    width : 100%;
    font-size : 16px;
    &[type="submit"]{
    corsor : pointer;
    &:hover {
     opacity : 0.8;
    }
    }
`;

const Error = styled.span`
    font-weight : 600;
    color : tomato;

`;

export default function CreateAccount(){
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { target:{name,value} } = e;
        if(name === "name"){
            setName(value)
        }else if(name === "email"){
            setEmail(value)
        }
        else if(name === "password"){
            setPassword(value)
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(isLoading || name=== "" || email === "" || password === "") return;
        try{
        setIsLoading(true);
        const credentials = await createUserWithEmailAndPassword(auth,email,password);
        console.log(credentials.user);
        await updateProfile(credentials.user, {displayName : name,})
        navigate("/");
        }catch(e){
            if(e instanceof FirebaseError){
                console.log(e.code,e.message);
            }
        }finally{
            setIsLoading(false);
        }
    }
    return( 
    <Wrapper>
        <Title>NWITTER 회원가입</Title>
        <Form onSubmit={onSubmit}>
            <Input name="name" onChange={onChange} value={name} placeholder="이름을 입력해주세요." type="text" required/>
            <Input name="email" onChange={onChange} value={email} placeholder="이메일을 입력해주세요." type="email" required/>
            <Input name="password" onChange={onChange} value={password} placeholder="비밀번호를 입력해주세요." type="password" required/>
            <Input type="submit" value={isLoading ? "로딩중":"가입하기"}/>
        </Form>
        {error !== ""? <Error>{error}</Error>:null}
    </Wrapper>
    );
   }