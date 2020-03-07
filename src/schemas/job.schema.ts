import * as mongoose from 'mongoose';

export const System = new mongoose.Schema({
  name: String,
  version: String,
  stagingEnvironment: String,
  datacenterEnvironment: String,
});

export const User = new mongoose.Schema({
  id: String,
});


export const Source = new mongoose.Schema({
  system: System,
  user: User
});

export const RequestContext = new mongoose.Schema({
  source: Source
});


export const Recipient = new mongoose.Schema({
  addressee: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  zip: String,
  zip4: String,
});

export const Conf = new mongoose.Schema({
  locationId: String,
  locationName: String,
});


export const Item = new mongoose.Schema({
  contentType: String,
  encodingType: String,
  content: String,
});

export const Storage = new mongoose.Schema({
  system: String,
  conf: Conf
});

export const Relationship = new mongoose.Schema({
  type: String,
  conf: {}
});

export const JobSchema = new mongoose.Schema({
  version: String,
  requestContext: RequestContext,
  recipient:Recipient,
  item: Item,
  storage: Storage,
  relationships: [Relationship]
});