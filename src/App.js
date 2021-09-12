import Navigation from './components/Navigation/Navigation';
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import Particles from 'react-particles-js';
import React,{ Component } from 'react';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'adfa083445024b1cb315bb88ac928381'
});

const particlesOptions={
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state={
      input:"",
      imageUrl:"",
      box:{},
      route: "signin",
      isSigndIn: false,
    }
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value});
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col*width,
      topRpw: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height),
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box: box});
  }


  onButtonSubmit=()=>{
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(      
      response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=> console.log(err));
  }

  onRouteChange=(route)=>{
    if (route==="signout"){
      this.setState({isSigndIn: false})
    }else if(route==="home"){
      this.setState({isSigndIn: true})
    }
    this.setState({route: route});
  }

  render(){
    return (
    <div className="App">
      <Particles className="particles"
                params={particlesOptions} />
      <Navigation isSigndIn={this.state.isSigndIn} onRouteChange={this.onRouteChange}/>
      {this.state.route ==="home"?
        <div>
        <Logo/>
        <Rank/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
      :(this.state.route === "signin"
      ?<Signin onRouteChange={this.onRouteChange}/>
      :<Register onRouteChange={this.onRouteChange}/>)
      }
    </div>
  );
  }
}

export default App;
