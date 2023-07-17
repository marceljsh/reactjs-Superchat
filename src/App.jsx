import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-whvsirjgRXS-6ukP-ZXqXN1RsbmrpR0",
  authDomain: "superchat-cffa7.firebaseapp.com",
  projectId: "superchat-cffa7",
  storageBucket: "superchat-cffa7.appspot.com",
  messagingSenderId: "259662808961",
  appId: "1:259662808961:web:7436459afe279702d94a80",
  measurementId: "G-EJGXXSMJY6"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
};

const SignOut = () => {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;

  const isCurrentUser = uid === auth.currentUser.uid;
  const messageClass = isCurrentUser ? 'sent' : 'received';

  console.log(`should be: ${text}`);

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} width='50px' alt='Profile' />
      <p>{text}</p>
    </div>
  )
};

const ChatRoom = () => {
  const dummy = useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">🕊️</button>
      </form>
    </>
  );
};

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>SuperChat🦸🏻‍♂️</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;
