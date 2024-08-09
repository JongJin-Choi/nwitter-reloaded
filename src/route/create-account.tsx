import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Form, Input, Switcher, Title, Wrapper, Errors } from "../components/auth-component";
import GithubButton from "../components/github-btn";
import GoogleButton from "../components/google-btn";





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
        setError("");
        if(isLoading || name=== "" || email === "" || password === "") return;
        try{
        setIsLoading(true);
        const credentials = await createUserWithEmailAndPassword(auth,email,password);
        console.log(credentials.user);
        await updateProfile(credentials.user, {displayName : name,})
        navigate("/");
        }catch(e){
            if(e instanceof FirebaseError){
              setError(e.message);
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
        {error !== ""? <Errors>{error}</Errors>:null}
        <Switcher>
            계정이 있으세요?<Link to="/login"> 로그인! &rarr;</Link>
        </Switcher>
        <GithubButton/>
        <GoogleButton/>
    </Wrapper>
    );
   }