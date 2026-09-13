import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCredentials } from '../src/utils/validation.js';
import { eventPayload } from '../src/controllers/eventController.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { saveWithImage } from '../src/utils/saveImage.js';

test('Credentials reject malformed input and normalize valid email', () => {
 for(const body of [null,{}, {email:42,password:'valid123'}, {email:'bad',password:'valid123'}, {email:'a@b.com',password:{}}, {name:'A',email:'a@b.com',password:'valid123'}, {name:'Valid',email:'a@b.com',password:'🙂'.repeat(20)}]) assert.throws(()=>validateCredentials(body,true),{statusCode:400});
 assert.equal(validateCredentials({name:' Valid ',email:' A@B.COM ',password:'valid123'},true).email,'a@b.com');
});
test('Event input rejects non-text fields, invalid dates and fractional capacity', () => {
 for(const body of [{title:{}},{capacity:1.5},{capacity:''},{capacity:[]},{capacity:0},{date:'invalid'},{date:'2000-01-01'}]) assert.throws(()=>eventPayload(body),{statusCode:400});
});
test('Public errors classify bad uploads/JSON and hide internal messages', () => {
 const res={status(value){this.code=value;return this;},json(value){this.body=value;}};
 for(const [error,code] of [[{name:'MulterError',code:'LIMIT_FILE_SIZE'},413],[{type:'entity.parse.failed'},400],[{name:'CastError'},400],[new Error('secret-database-uri'),500]]){
  errorHandler(error,{},res,()=>{});assert.equal(res.code,code);assert.ok(!JSON.stringify(res.body).includes('secret-database-uri'));
 }
});
test('Image save validates first and cleans up only the right asset', async () => {
 const actions=[];let invalid=false,failed=false;
 const doc={posterPublicId:'old',validate:async()=>{actions.push('validate');if(invalid)throw Error('validation');},save:async()=>{actions.push('save');if(failed)throw Error('save');}};
 const services={uploadBuffer:async()=>{actions.push('upload');return {secure_url:'https://image',public_id:'new'};},deleteImage:async id=>actions.push('delete:'+id)};
 const options={field:'poster',idField:'posterPublicId',folder:'test'};
 invalid=true;await assert.rejects(saveWithImage(doc,{buffer:Buffer.alloc(0)},options,services));assert.deepEqual(actions,['validate']);
 invalid=false;failed=true;actions.length=0;await assert.rejects(saveWithImage(doc,{buffer:Buffer.alloc(0)},options,services));assert.deepEqual(actions,['validate','upload','save','delete:new']);
 failed=false;doc.posterPublicId='old';actions.length=0;await saveWithImage(doc,{buffer:Buffer.alloc(0)},options,services);assert.deepEqual(actions,['validate','upload','save','delete:old']);
});
