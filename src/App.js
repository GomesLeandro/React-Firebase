import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection';
import { doc, setDoc,collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import './app.css';
import { async } from '@firebase/util';

function App() {
  const[titulo, setTitulo] = useState('');
  const[autor, setAutor] = useState('');
  const[idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({})

  const [posts, setPosts] = useState([]);

    // atualização em tempo real
  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

      snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          titulo: doc.data().titulo, //BUSCANDO MAIS DE POST NO BANCO
          autor: doc.data().autor,
        })
      })

      setPosts(listaPost);

      })
    }

    loadPosts();

  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          //se tem usuario logado ele entra aqui...
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          //nao possui nenhum user logado.
          setUser(false);
          setUserDetail({})
        }
      } )
    }

    checkLogin();

  }, [])

  async function handleAdd(){
    /*await setDoc(doc(db, "posts", "12345"), {
      titulo: titulo,
      autor: autor,
    })
    .then (() => {
      console.log("DADOS REGISTRADO NO BANCO!") //FORMA DE CRIAR ID FIXO
    })
    .catch((error) => {
      console.log("GEROU ERRO" + error)
    })*/
  await addDoc(collection(db, "posts"), {
    titulo: titulo,
    autor: autor,
  })
  .then(()=> {
    console.log("DADOS REGISTRADOS NO BANCO") //FORMA DE CRIAR ID ALEATÓRIO
    setAutor(''); //zerando o campo de preenchimento autor
    setTitulo('') //zerando o campo de preenchimento titulo
  })
  .catch((error) => {
    console.log("ERRO" + error)
  })

  }

  async function buscarPost(){

    /*const postRef = doc( db, "posts", "12345")

    await getDoc(postRef)
    .then((snapshot) => {
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)// BUSCANDO POST NO BANCO DE DADOS
    })
    .catch(()=>{
      console.log("ERRO AO BUSCAR")
    })*/

    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo, //BUSCANDO MAIS DE POST NO BANCO
          autor: doc.data().autor,
        })
      })

      setPosts(lista);

    })
    .catch((error) => {
      console.log("DEU ALGUM ERRO AO BUSCAR")
    })

  }
//atualizar post
  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log("POST ATUALIZADO")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(()=> {
      console.log("ERRO AO ATUALIZAR O POST")
    })
  }

// deletar post
  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() =>{
      alert("POST DELETADO COM SUCESSO! ")
    })
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() =>{
      console.log("CADASTRADO COM SUCESSO!")
      setEmail('')
      setSenha('')
    })
    .catch((error) =>{

      if(error.code === 'auth/weak-password'){
        alert("Senha muito fraca")
      }else if (error.code === 'auth/email-already-in-use'){ // confirmação firebase de senha e email
        alert("Email já existe")
      }

    })
  }

  async function logarUsuario(){  
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("USER LOGADO COM SUCESSO")
      console.log(value.user);

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true);

      setEmail('')
      setSenha('')
    })
    .catch(() => {
      console.log("ERRO AO FAZER O LOGIN")
      alert('ERRO AO FAZER O LOGIN')
    })

  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({})
  }

  return (
    <div className="App">
      <h1>ReactJS + Firebase :)</h1>

      { user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span> <br/>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br/><br/>
        </div>
      )}

      <div className='container'>
        <h2>Usuários</h2>

        <label>Email</label>
        <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite um email"
        /> <br/>

        <label>Senha</label>
        <input 
        value={senha} 
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Informe sua senha"
        /> <br/>

        <button onClick={novoUsuario}>Cadastrar</button><br/>
        <button onClick={logarUsuario}>Fazer login</button><br/>
      </div>

      <br/><br/>
      <hr/>

      <div className='container'>
        <h2>POSTS</h2>

        <label>ID do Post:</label>
        <input
        placeholder='Digite o ID do post'
        value={idPost}
        onChange={ (e) => setIdPost(e.target.value)}
        /> <br/>

        <label>Titulo:</label>
        <textarea
          type= 'text' 
          placeholder='digite o titulo'
          value={titulo}
          onChange={ (e) => setTitulo(e.target.value) }
          /> 

          <label>Autor:</label>
          <input 
            type="text"
            placeholder='Autor do post'
            value={autor}
            onChange={ (e) => setAutor(e.target.value)}
          />

          <button onClick={handleAdd}>Cadastrar</button><br/>
          <button onClick={buscarPost}>Buscar post</button><br/>
          <button onClick={editarPost}>Atualizar post</button>

          <ul>
            {posts.map( (post) => {
              return(
                <li key={post.id}>
                  <strong>ID: {post.id}</strong> <br/>
                  <span>Titulo: {post.titulo}</span> <br/>
                  <span>Autor: {post.autor}</span> <br/>
                  <button onClick={ () => excluirPost(post.id) }>Excluir</button> <br/><br/>
                </li>
              )
            })}
          </ul>


      </div>
        
    </div>
  );
}

export default App;
