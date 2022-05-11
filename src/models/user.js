const mongoose = require('mongoose');
const { Schema } = mongoose; //solo de la parte mongoose quiero el objeto scheema
import { user } from '../class/userClass';

new Schema({
    user: { type: user }
})