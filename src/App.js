import 'antd/dist/antd.min.css';
import './App.css'
import { Button } from 'antd';
import {useState} from 'react'
import Home from './component/table';
import axios from 'axios';
import React, { useRef} from 'react';
let timer = null
let audio = document.createElement('audio');
const jojo = require('./assets/audio/jojo.m4a')
audio.setAttribute('src', jojo);
function App() {
  let [nameArr, setNameArr] = useState([]);
  const countSaver = useRef(0);
  let [count, setCount] = useState(countSaver.current);
  let [quering, setQuering] = useState(false);
  let [success, setSuccess] = useState(false);
  function startQuery(){
    reset();
    const {dataSource} = tableEl.current.state
    const nameArr = dataSource.map(item=>item.name)
    setNameArr(nameArr)
    if(!timer){
      setQuering(true)
      const timerFunc=()=>{
        countSaver.current = ++countSaver.current; 
        setCount(countSaver.current)
        queryServerInfo().then((res)=>{
            if(res?.data){
              nameArr.forEach(element => {
                if(res.data.includes(element)){
                  audio.play()
                  setSuccess(true)
                  clearInterval(timer)
                }
              });
            }
          }
        );
      }
      timerFunc()
      timer = setInterval(timerFunc,5000)
    }
  }
  function queryServerInfo(){
    const url = 'https://fyscs.com/KxnrlApp/';
    const formData = new FormData();
    formData.append('action','dashboard')
    formData.append('token','')
    return axios.post(url,formData)
  }
  function stopQuery(){
    reset()
  }
  function reset(){
    setSuccess(false)
    clearInterval(timer)
    timer = null
    setQuering(false)
    countSaver.current = 0; 
    audio.pause()
  }
  const tableEl = useRef(null);
  return (
    <div className="App">
      <Home ref={tableEl}>
      </Home>
      <IsQuering nameArr={nameArr} count={count} quering={quering}></IsQuering>
      <Gogogo success={success}></Gogogo>
      <Button type="primary" onClick={()=>startQuery()}>开始查询</Button>
      <Button type="primary" onClick={()=>stopQuery()}>停止查询</Button>
    </div>
  );
}

const IsQuering = (props)=>{
  if(props.quering){
    return (
        <p>
          正在查询 {props.nameArr.join(' ')}
          <br></br>
          已查询{props.count}次
        </p>
    )
  } else{
    return(
      <p>
          未在查询
      </p>
    )
  }
}
const Gogogo = (props)=>{
  if(props.success){
    return(
      <p>
        冲冲冲！
      </p>
    )
  }
}

export default App;
