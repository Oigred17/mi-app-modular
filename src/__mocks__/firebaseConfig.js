// Mock de Firebase para tests
const mockFirestore = {
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000 })),
  writeBatch: jest.fn(),
};

export const db = mockFirestore;

export const collection = jest.fn((db, collectionName) => ({
  _collectionName: collectionName,
}));

export const query = jest.fn((collectionRef, ...queryConstraints) => ({
  _collection: collectionRef,
  _constraints: queryConstraints,
}));

export const orderBy = jest.fn((field, direction) => ({
  _field: field,
  _direction: direction,
}));

export const onSnapshot = jest.fn((query, callback) => {
  // Mock unsubscribe function
  return jest.fn();
});

export const doc = jest.fn((db, collectionName, docId) => ({
  _collection: collectionName,
  _id: docId,
}));

export const serverTimestamp = jest.fn(() => ({
  seconds: Date.now() / 1000,
  toDate: () => new Date(),
}));

export const writeBatch = jest.fn(() => ({
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  commit: jest.fn(() => Promise.resolve()),
}));
