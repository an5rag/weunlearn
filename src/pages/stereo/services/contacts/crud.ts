import { firestore } from "firebase";
import { IContact, IContactWithID } from "./types";
import { mockContacts } from "./mocks";

export async function getContacts(groupId?: string): Promise<IContactWithID[]> {
  const contactsCollectionRef = getContactsRef();
  const snapshot: firestore.QuerySnapshot = await getContactsQuery(
    contactsCollectionRef,
    groupId
  ).get();
  return snapshot.docs.map(mapDocumentToContact);
}

export async function getContact(
  contactId: string
): Promise<IContactWithID | undefined> {
  const contactsCollectionRef = getContactsRef();
  const document = await contactsCollectionRef.doc(contactId).get();
  if (document.data()) {
    return mapDocumentToContact(document as firestore.QueryDocumentSnapshot);
  }
}

export function getContactsSubscription(
  fn: (contacts: IContactWithID[]) => void,
  groupId?: string
): () => void {
  const contactsCollectionRef = getContactsRef();
  return getContactsQuery(contactsCollectionRef, groupId).onSnapshot(snapshot =>
    fn(snapshot.docs.map(mapDocumentToContact))
  );
}

export async function addContact(contact: IContact): Promise<string> {
  const contactsCollectionRef = getContactsRef();
  const document = await contactsCollectionRef.add(contact);
  return document.id;
}

export async function updateContact(
  id: string,
  partialContact: Partial<IContact>
): Promise<void> {
  const contactsCollectionRef = getContactsRef();
  const document = await contactsCollectionRef.doc(id);
  await document.update(partialContact);
}

export async function deleteContact(id: string): Promise<void> {
  const contactsCollectionRef = getContactsRef();
  const document = await contactsCollectionRef.doc(id);
  await document.delete();
}

export async function addMockDataToDb(): Promise<void> {
  mockContacts.forEach(contact => {
    addContact(contact);
  });
}

function getContactsQuery(
  contactsCollectionRef: firestore.CollectionReference,
  groupId?: string
): firestore.Query {
  if (groupId) {
    return contactsCollectionRef.where("groupIds", "array-contains", groupId);
  } else {
    return contactsCollectionRef;
  }
}

function mapDocumentToContact(
  document: firestore.QueryDocumentSnapshot
): IContactWithID {
  const data = document.data();
  const contact: IContactWithID = {
    name: data.name,
    id: document.id,
    company: data.company,
    phone: data.phone,
    groupIds: data.groupIds
  };
  return contact;
}

function getContactsRef() {
  const db = firestore();
  return db.collection("contacts");
}
