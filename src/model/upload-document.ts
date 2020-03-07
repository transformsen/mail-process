export interface UploadRequest{
    file: File
    metadatas: Metadatas
}

export interface File{
    bytes: string,
    url: string,
    bucket: Bucket
    contentType: string
}

export interface Bucket{
    bucketName: string,
    bucketKey: string
}

export interface Metadatas{

    locationId: number,
    locationName: string,
    templateId: number,
    fieldArray: FieldArray[]
}

export interface FieldArray{
    id: number,
    fieldName: string,
    fieldValue: string
}