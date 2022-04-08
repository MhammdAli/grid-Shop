export function convertDocToObject(doc){
    doc._id = doc?._id.toString()
    if(doc.createdAt)  doc.createdAt = doc.createdAt.toString()
    if(doc.updatedAt)  doc.updatedAt = doc.updatedAt.toString() 
    return doc
}