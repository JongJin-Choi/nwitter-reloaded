import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Input, Switcher, Title, Wrapper, Errors } from "../components/auth-component";
import GithubButton from "../components/github-btn";





export default function Login(){
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { target:{name,value} } = e;
         if(name === "email"){
            setEmail(value)
        }
        else if(name === "password"){
            setPassword(value)
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setError("");
        if(isLoading || email === "" || password === "") return;
        try{
        setIsLoading(true);
        await signInWithEmailAndPassword(auth,email,password);
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
        <Title>NWITTER 로그인</Title>
        <Form onSubmit={onSubmit}>
            <Input name="email" onChange={onChange} value={email} placeholder="이메일을 입력해주세요." type="email" required/>
            <Input name="password" onChange={onChange} value={password} placeholder="비밀번호를 입력해주세요." type="password" required/>
            <Input type="submit" value={isLoading ? "로딩중":"로그인"}/>
        </Form>
        {error !== ""? <Errors>{error}</Errors>:null}
        <Switcher>
            계정이 없으세요?<Link to="/create-account"> 회원가입! &rarr;</Link>
        </Switcher>
        <GithubButton/>
    </Wrapper>
    );
   }