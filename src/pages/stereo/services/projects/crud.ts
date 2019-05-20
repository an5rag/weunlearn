import { firestore } from "firebase";
import { IProject, IProjectWithId } from "./types";

export async function getProjects(): Promise<IProjectWithId[]> {
  const projectsCollectionRef = getProjectsRef();
  const snapshot: firestore.QuerySnapshot = await projectsCollectionRef.get();
  return snapshot.docs.map(mapDocumentToProject);
}

export async function getProject(
  projectId?: string
): Promise<IProjectWithId | undefined> {
  const projectsCollectionRef = getProjectsRef();
  const document = await projectsCollectionRef.doc(projectId).get();
  if (document.data()) {
    return mapDocumentToProject(document as firestore.QueryDocumentSnapshot);
  }
}

export function getProjectsSubscription(
  fn: (projects: IProjectWithId[]) => void
): () => void {
  const projectsCollectionRef = getProjectsRef();
  return projectsCollectionRef.onSnapshot(snapshot =>
    fn(snapshot.docs.map(mapDocumentToProject))
  );
}

export async function addProject(project: IProject): Promise<string> {
  const projectsCollectionRef = getProjectsRef();
  const document = await projectsCollectionRef.add(project);
  return document.id;
}

export async function updateProject(
  id: string,
  partialProject: Partial<IProject>
): Promise<void> {
  const projectsCollectionRef = getProjectsRef();
  const document = await projectsCollectionRef.doc(id);
  await document.update(partialProject);
}

export async function deleteProject(id: string): Promise<void> {
  const projectsCollectionRef = getProjectsRef();
  const document = await projectsCollectionRef.doc(id);
  await document.delete();
}

function mapDocumentToProject(
  document: firestore.QueryDocumentSnapshot
): IProjectWithId {
  const data = document.data();
  const project: IProjectWithId = {
    name: data.name,
    id: document.id,
    dateCreated: data.dateCreated,
    description: data.description
  };
  return project;
}

function getProjectsRef() {
  const db = firestore();
  return db.collection("projects");
}
