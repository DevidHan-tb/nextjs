
import { Button, } from 'antd'
import axios, { AxiosResponse } from 'axios'
import React, { ChangeEvent, useState } from 'react'
import { Progress } from 'tdesign-react';
import 'tdesign-react/es/style/index.css';
import SparkMD5 from 'spark-md5'

// 上传状态 
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'
// 1MB
const CHUNK_SIZE = 1024 * 1024

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploadLong, setUploadLong] = useState(0);
  const [uploadedChunkCount, setUploadedChunkCount] = useState(0);

  // 选择文件时，读取上传的文件
  let handleFileChange = (e: Event) => {
    let files = (e.target as HTMLInputElement).files;
    if (files) {
      setFile(files[0]);
      setFileName(files[0].name);
      // 重置进度相关状态
      setUploadLong(0);
      setUploadedChunkCount(0);
      setStatus('idle'); // 选择文件后重置为空闲状态
    }
  }

  // 对文件进行切片
  let createChunks = (files: File) => {
    let cur = 0;
    let chunks = [];

    while (cur < files.size) {
      let bob = files.slice(cur, cur + CHUNK_SIZE);
      chunks.push(bob);
      cur += CHUNK_SIZE;
    }
    // console.log(chunks);

    return chunks;
  }

  // 计算hash值
  let calculateHash = async (chunks: Blob[]) => {
    return new Promise(resolve => {
      // 第一个和最后一个切片全部参与计算
      // 中间的切片只计算前面两个字节，中间两个字节，最后两个字节
      let targets: Blob[] = [];   // 存储所有参与计算的切片

      let spark = new SparkMD5.ArrayBuffer();
      let fileReader = new FileReader();


      chunks.forEach((chunk, index) => {
        if (index === 0 || index === chunks.length - 1) {
          // 第一个和最后一个切片全部参与计算
          targets.push(chunk);
        } else {
          // 中间的切片只计算前面两个字节，中间两个字节，最后两个字节
          targets.push(chunk.slice(0, 2));// 前面的两个字节
          targets.push(chunk.slice(CHUNK_SIZE / 2, CHUNK_SIZE / 2 + 2));// 中间的两个字节
          targets.push(chunk.slice(CHUNK_SIZE - 2, CHUNK_SIZE));// 最后的两个字节
        }
      });

      fileReader.readAsArrayBuffer(new Blob(targets));
      fileReader.onload = (e) => {
        let targets=e.target?.result
        spark.append(targets as ArrayBuffer);
        // 拿到计算出的hash值
        let hash = spark.end()
        console.log('hash:', hash);
        resolve(hash);
      }
    })

  }

  // 合并分片
  let mergeRequest = (hashs:string) => {
    axios(
      {
        method: 'post',
        url: 'http://localhost:8000/HTB/merge',
        data: { fileHash: hashs, fileName: fileName, size: CHUNK_SIZE },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    ).then(res => {
      alert('合并成功')
    })
  }



  // 上传分片
  let uploadChunks = async (chunks: Blob[], existChunks: string[],hashs:string) => {
    let data = chunks.map((chunk, index) => {
      return {
        fileHash: hashs,
        chunkHash: hashs + '-' + index,
        chunk
      }
    });
    let formDatas = data.map((item) => {
      let formData = new FormData();
      formData.append('fileHash', item.fileHash);
      formData.append('chunkHash', item.chunkHash);
      formData.append('chunk', item.chunk);

      return formData;
    });

    let max = 6; // 最大并发请求数
    let index = 0;
    let taskPool: any = []; // 请求池
    const totalChunks = formDatas.length; // 总切片数量

    while (index < formDatas.length) {
      let task = await axios.post('http://localhost:8000/HTB/upload', formDatas[index],

      );

      taskPool.splice(taskPool.findIndex((item: any) => item === task), 1);
      taskPool.push(task);
      if (taskPool.length === max) {
        await Promise.race(taskPool);
      }
      // 成功上传一个切片后，更新已上传切片数量和进度状态
      index++;
      setUploadedChunkCount((prevCount) => prevCount + 1);
      setUploadLong((100));
    }
    await Promise.all(taskPool);

    mergeRequest(hashs);
  }

  // 校验hash值
  let verify = async (hashs:string) => {
    const res = await axios(
      {
        method: 'post',
        url: 'http://localhost:8000/HTB/verify',
        data: { fileHash: hashs, fileName: fileName, size: CHUNK_SIZE },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    const res_1 = res;
    return res_1.data;
  }


  // 上传
  let handleFileUpload = async () => {
    if (!file) return
    setStatus('uploading'); // 设置为上传中状态
    setUploadLong(0);

    // 文件分片
    const chunks = createChunks(file);
    console.log(file);

    // 计算hash值
    const hashs = await calculateHash(chunks);
    console.log(fileHash);
    console.log('hashs', hashs);
    setFileHash(hashs as string);
    

    // 校验hash值：秒传
    let data = await verify(hashs as string);
    console.log(data);
    if (!data.data.shouldUpload) {
      alert('秒传：成功');
      setStatus('success'); // 秒传成功直接设置为成功状态
      return
    } else {
      // 上传分片
      try {
        await uploadChunks(chunks, data.data.existChunks,hashs as string);
        setStatus('success'); // 切片上传并合并成功后设置为成功状态
      } catch (error) {
        // 这里可以添加更详细的错误处理逻辑，比如根据不同错误情况提示用户等
        setStatus('error'); // 如果出现错误设置为错误状态
      }
    }
  }
  return (
    <div>
      <input type="file" multiple onChange={(e)=>{handleFileChange(e)}} />
      {
        file && (
          <div>
            <p>File name：{file.name}</p>
            <p>Size：{(file.size / 1024 / 1024).toFixed(2)}MB</p>
            <p>Type：{file.type}</p>
          </div>
        )
      }
      {
        status === 'uploading' && (
          <>
            <Progress theme="plump" percentage={uploadLong} />
            
            {/* 这里可以添加取消上传按钮等交互元素，暂未实现具体功能 */}
          </>
        )
      }
      {
        file && status === 'idle' && <Button onClick={handleFileUpload}>Upload</Button>
      }
      {
        status === 'success' && (
          <>
            <p>上传成功！</p>
            <p>ok！!</p>
          </>
        )
      }
      {
        status === 'error' && (
          <p>上传失败，请检查网络或稍后重试。</p>

        )
      }
    </div>
  )
}