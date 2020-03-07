import { Document } from 'mongoose';
export interface Job extends Document{
    version: string
    requestContext: Request
    recipient:Recipient
    item: Item
    storage: Storage
    relationships: Relationship[]
}

export interface RequestContext{
    source: Source
}

export interface Source{
    system: System
    user: User
}

export interface System{
    name: string
    version: string
    stagingEnvironment: string
    datacenterEnvironment: string
}

export interface User{
    id: string
}

export interface Recipient{
    addressee: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zip: string
    zip4: string
}

export interface Item{
    contentType: string
    encodingType: string
    content: string
}

export interface Storage{
    system: string,
    conf: Conf
}

export interface Conf{
    locationId: string
    locationName: string
}

export interface Relationship{
    type: string
    conf: any
}