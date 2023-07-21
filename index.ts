import {Polybase, PolybaseError} from "@polybase/client";
import {CollectionNames, DefaultNamespace, filfox} from "@dataprograms/repdao-polybase";

const polydb = new Polybase({
    defaultNamespace: DefaultNamespace,
})

const provider = 'f01889512'

// Use typescript types
const doc = (await polydb.collection('filfox')
    .where('provider', '==', provider)
    .limit(1).get())
    .data[0].data as filfox

console.log(`Filfox record for ${provider}: total rewards: ${doc.totalRewards}`)

for (const collectionName of CollectionNames) {
    let response
    try {
        response = await polydb.collection(collectionName).where('provider', '==', provider).limit(1).get()
    } catch (e: any) {
        if (e instanceof PolybaseError) {
            console.error(`Polybase error: ${e.code} ${e.message} when retrieving ${collectionName} record for ${provider}`)
            continue
        }

        throw e
    }
    if (response.data.length === 0) {
        console.log(`No ${collectionName} record for ${provider}`)
        continue
    }
    const doc = response.data[0].data
    console.log(`${collectionName} record for ${provider}:`)
    console.log(doc)
}
