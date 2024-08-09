import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

/* export interface EditITweet {
  id: string;
  photo?: string;
  tweet: string;
  setIsEditing: () => boolean;
} */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 20px;
  background-color: black;
  border: 2px solid white;
  border-radius: 20px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: white;
  resize: none;
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
  border: 1px solid currentColor;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  color: #1d9bf0;
  text-align: center;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 10px 0px;
  background-color: #1d9bf0;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function EditTweetForm({ photo, tweet, id, setIsEditing }) {
  const [isLoading, setIsLoading] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [editFile, setEditFile] = useState<File | null>(null);
  const MaxSize = 10*1024*1204 ;

  // console.log(id, tweet, photo);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };
  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if(files &&  files[0].size > MaxSize){
        alert("업로드하는 파일이 10MB가 넘습니다." )
            return;
    }

    if (files && files.length === 1) {
      // console.log(files);

      setEditFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || editTweet === "" || editTweet.length > 180)
      return;

    try {
      setIsLoading(true);
      const tweetRef = doc(db, "tweets", id);
      await updateDoc(tweetRef, {
        tweet: editTweet,
      });

      if (editFile) {
        if (photo) {
          const originRef = ref(storage, `tweets/${user.uid}/${id}`);
          await deleteObject(originRef);
        }

        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, editFile);
        const url = await getDownloadURL(result.ref);

        // console.log(url);

        await updateDoc(tweetRef, {
          photo: url,
        });
      }
      setEditTweet("");
      setEditFile(null);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
      />
      <AttachFileButton htmlFor={`editFile${id}`}>
        {editFile ? "사진 첨부완료! ✅" : photo ? "사진 변경" : "사진 추가"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onEditFileChange}
        id={`editFile${id}`}
        type="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "수정중..." : "트윗수정"}
      />
    </Form>
  );
}