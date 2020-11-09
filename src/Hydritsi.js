
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
        if (!store.faceApiLoaded) {

            // faceapi.nets.ssdMobilenetv1.isLoaded
            // faceapi.nets.faceLandmark68Net.isLoaded
            // faceapi.nets.faceExpressionNet.isLoaded

            await faceapi.nets.ssdMobilenetv1.load('/static/models/')
            await faceapi.loadFaceLandmarkModel('/static/models/')
            await faceapi.loadFaceExpressionModel('/static/models/')
            store.faceApiLoaded = true;
            // alert('faceApi loaded!')
        }

        // update...
        try {
            await window.update( this.p5, inputVideo, outputCanvas );
        } catch(err) {
            console.log("❌ [hydritsi] couldn't update", err);

        }  

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