
import p5 from 'p5';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as blazeFace from '@tensorflow-models/blazeface';
import Hydra from 'hydra-synth'
import * as faceapi from 'face-api.js';

// face-api.js models:
// ageGenderNet
// faceExpressionNet
// faceLandmark68Net
// faceLandmark68TinyNet
// faceRecognitionNet
// ssdMobilenetv1
// tinyFaceDetector
// tinyYolov2

class Hydritsi {

    // private:

    constructor() {

        // keypress event:
        // toggle hydritsi with TAB etc....

        document.body.addEventListener('keypress', e => this.onWindowKeyPress(e), true)

        // websockets communication:
        // send data in and out of Hydritsi...

        // this.websocket = new WebSocket("ws://localhost:9998")
        // this.websocket.onopen = this.onSocketOpen
        // this.websocket.onmessage = this.onSocketMessage
        // this.websocket.onclose = this.onSocketClose

        // manifest:
        // store a list of video streams and participants...
        this.code = '';
        this.tempCode = '';

        this.streams = {};
        this.participants = {};
        this.messages = [];
        this.autoScale = true;


        this.hydra = undefined;
        this.me = undefined;
        this.outputCanvas = undefined;

        // ML helpers:

        this.helpers = {
            faceapi: {
                facialExpression: async () => {

                }
            }
        }

        window.faceapi = faceapi;

        // P5:
        // setup P5 for drawing on your video output...

        this.timestamp = 0;
        this.dt = 0;

        this.faceApiLoaded = false;

        this.p5 = new p5( (p) => {
            p.setup = () => { 

                this.p5.createCanvas(640, 360);

                console.log('👾 [hydritsi] p5 setup');
                this.loadTensorFlow();


            }
            p.draw = () => { 

                const t = Date.now();
                this.dt = t - this.timestamp;
                // only draw P5 if outputCanvas from JitsiBlurEffect.js has been inited...

                if (this.outputCanvas) {

                    this.p5.clear();
                    this.p5.background(0);

                    // scale everything to outputCanvas:
                    // makes things simpler when drawing video tracks, or CV outputs...

                    let scale = { x: 1, y: 1 };
                    if (this.autoScale) {
                        scale.x = this.p5.width / this.outputCanvas.width;
                        scale.y = this.p5.height / this.outputCanvas.height;
                        this.p5.scale(   scale.x, scale.y  );
                    }

                    // EZ-access draw...

                    try {
                        window.draw( )
                    } catch( err ) {
                        console.log("❌ [hydritsi] couldn't run window.draw()", err);
                    }

                    if (this.hydra) {

                        try {
                            this.hydra.tick( this.dt  )
                        } catch( err ) {
                            console.log("❌ [hydritsi] couldn't render hydra", err);
                        }
                    }
                }

                this.timestamp = t;
            }
        });

        window.p5 = this.p5;
        window.streams = this.streams;
        window.participants = this.participants;


    }


    async loadTensorFlow() {

        this.bpModel = await bodyPix.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.50,
            quantBytes: 2
        });
        this.blazeFace = await blazeFace.load();
        console.log('👾 [hydritsi] loaded TensorFlow', this.bpModel);
        return this.bpModel;
    }

    async updateLoop( inputVideo, outputCanvas  ) {
        if (!this.faceApiLoaded) {

            // faceapi.nets.ssdMobilenetv1.isLoaded
            // faceapi.nets.faceLandmark68Net.isLoaded
            // faceapi.nets.faceExpressionNet.isLoaded

            await faceapi.nets.ssdMobilenetv1.load('/static/models/')
            await faceapi.loadFaceLandmarkModel('/static/models/')
            await faceapi.loadFaceExpressionModel('/static/models/')
            this.faceApiLoaded = true;
            // alert('faceApi loaded!')
        }

        // update...
        try {
            await window.update( this.p5, inputVideo, outputCanvas );
        } catch(err) {
            console.log("❌ [hydritsi] couldn't update", err);

        }  

    }

    reloadScript( code ) {
        console.log('👾 [hydritsi] reloadScript', code.length);
        this.tempCode = code;
        try {

            eval( this.tempCode);

        } catch( err) {

            try {
                eval( this.code );
                console.log('👾 [hydritsi] fallback to old code', code.length);

            } catch( err ) {
                console.log("❌ [hydritsi] couldn't eval new or old code", err);
            }
        }

        try {
            if (this.hydra) window.setup();
        } catch( err ) {
            console.log("❌ [hydritsi] couldn't run window.setup()", err);
        }


    }
    onSocketOpen(e) {
        console.log('👾 [hydritsi] onSocketOpen', e);
        
    }
    onSocketMessage(e) {
        console.log('👾 [hydritsi] onSocketMessage', e);
        
    }
    onSocketClose(e) {
        console.log('👾 [hydritsi] onSocketClose', e);
        
    }
    onWindowKeyPress(e) {
        // console.log('👾 [hydritsi] keyPress', e, this);
    }
    onJitsiAttachedVideo(e) {
        console.log('👾 [hydritsi] attachVideo', e);
        this.streams[ e.videoTrack.participantId ] = e;
    }
    onJitsiDetachedVideo(e) {
        console.log('👾 [hydritsi] detachVideo', e);
        this.streams[e.videoTrack.participantId] = null;
    }
    onJitsiMessageReceived(e) {
        console.log('👾 [hydritsi] messageReceived', e);

        try {
            window.onMessage( e );
        } catch (err) {
            console.log("❌ [hydritsi] couldn't trigger onMessage event", err);

        }
    }
    onJitsiDisplayNameChanged(e) {
        console.log('👾 [hydritsi] displayNameChanged', e);
    }
    onDisabled() {
        delete this.hydra;
        this.me = null;
        this.outputCanvas = null;
        this.hydra = null;
        // alert('DISABLED');
    }
    onEnabled( e ) {

        console.log('👾 [hydritsi] hydritsiEnabled', e.inputVideo, e.outputCanvas);

        this.me = e.inputVideo;
        this.outputCanvas = e.outputCanvas;

        if (!this.hydra) {
            this.hydra = new Hydra({ 
                canvas: e.outputCanvas, 
                autoLoop: false
            });
            this.hydra.setResolution(this.outputCanvas.width, this.outputCanvas.height)
            window.hydra = this.hydra.synth;
            setTimeout( () => this.reloadScript(this.code), 1000);
        }
        // alert('EN ABLED');
    }

    async getBodyShape( inputVideo, bounds, config ) {
        if (!config) config = {
            internalResolution: 'medium', // resized to 0.5 times of the original resolution before inference
            maxDetections: 1, // max. number of person poses to detect per image
            segmentationThreshold: 0.7 // represents probability that a pixel belongs to a person
        }
        return await this.bpModel.segmentPerson(inputVideo, config);
    }
    getTotalStreams() {
        return Object.keys( this.streams );
    }
    getStreamAtIndex( idx ) {
        return this.streams[ Object.keys(this.streams)[0] ];
    }
}

export default Hydritsi