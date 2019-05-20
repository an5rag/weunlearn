import { firestore } from "firebase";
import { IContactGroup, IContactGroupWithID } from "./types";
import { mockGroups } from "./mocks";
import { getContacts, updateContact } from "../contacts/crud";

export async function getContactGroups(): Promise<IContactGroupWithID[]> {
  const contactGroupsCollectionRef = getContactGroupsRef();
  const snapshot: firestore.QuerySnapshot = await contactGroupsCollectionRef.get();
  return snapshot.docs.map(mapDocumentToContactGroup);
}

export async function getContactGroup(
  contactGroupId?: string
): Promise<IContactGroupWithID | undefined> {
  const contactGroupsCollectionRef = getContactGroupsRef();
  const document = await contactGroupsCollectionRef.doc(contactGroupId).get();
  if (document.data()) {
    return mapDocumentToContactGroup(
      document as firestore.QueryDocumentSnapshot
    );
  }
}

export function getContactGroupsSubscription(
  fn: (contactGroups: IContactGroupWithID[]) => void
): () => void {
  const contactGroupsCollectionRef = getContactGroupsRef();
  return contactGroupsCollectionRef.onSnapshot(snapshot =>
    fn(snapshot.docs.map(mapDocumentToContactGroup))
  );
}

export async function addContactGroup(
  contactList: IContactGroup
): Promise<string> {
  const contactGroupsCollectionRef = getContactGroupsRef();
  const document = await contactGroupsCollectionRef.add(contactList);
  return document.id;
}

export async function updateContactGroup(
  id: string,
  partialContactGroup: Partial<IContactGroup>
): Promise<void> {
  const contactGroupsCollectionRef = getContactGroupsRef();
  const document = await contactGroupsCollectionRef.doc(id);
  await document.update(partialContactGroup);
}

export async function deleteContactGroup(id: string): Promise<void> {
  const contactGroupsCollectionRef = getContactGroupsRef();
  const document = await contactGroupsCollectionRef.doc(id);
  const contactsOnGroup = await getContacts(id);
  const promises = contactsOnGroup.map(contact => {
    const groupIndex = contact.groupIds.findIndex(groupId => groupId === id);
    if (groupIndex > -1) {
      contact.groupIds.splice(groupIndex, 1);
      return updateContact(contact.id, { groupIds: contact.groupIds });
    } else {
      return Promise.resolve();
    }
  });
  await Promise.all(promises);
  await document.delete();
}

export async function addMockDataToDb(): Promise<void> {
  mockGroups.forEach(contactList => {
    addContactGroup(contactList);
  });
}

function mapDocumentToContactGroup(
  document: firestore.QueryDocumentSnapshot
): IContactGroupWithID {
  const data = document.data();
  const contactList: IContactGroupWithID = {
    name: data.name,
    id: document.id,
    description: data.description
  };
  return contactList;
}

function getContactGroupsRef() {
  const db = firestore();
  return db.collection("contactgroups");
}
