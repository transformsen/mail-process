import { ApiProperty } from "@nestjs/swagger";

export class JobDto {
    version: string
    requestContext: RequestContext
    recipient: Recipient
    item: Item
    storage: Storage
    relationships: Relationship[]
}

export class RequestContext {
    source: Source
}

export class Source {
    system: System
    user: User
}

export class System {
    name: string
    version: string
    stagingEnvironment: string
    datacenterEnvironment: string
}

export class User {
    id: string
}

export class Recipient {
    addressee: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zip: string
    zip4: string
}

export class Item {
    contentType: string
    encodingType: string
    content: string
}

export class Storage {
    system: string
    conf: Conf
}

export class Conf {
    locationId: string
    locationName: string
}

export class Relationship {
    type: string
    conf: any
}