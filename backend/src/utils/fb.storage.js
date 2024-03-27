const { initializeApp } = require('firebase/app');
const {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
  uploadBytes
} = require('firebase/storage');
const { nanoid } = require('nanoid');
const { firebase } = require('../keys.js');

// Inicializar Firebase
const app = initializeApp(firebase);
const storage = getStorage(app);
const refs = {
  logosRef: ref(storage, 'logos'),
  avatarsRef: ref(storage, 'avatars'),
  DNIsRef: ref(storage, 'DNIs')
};

// Delete the file
const deleteFile = async url => {
  try {
    if (typeof url === 'string') {
      const reference = await getRefByUrl(url);
      await deleteObject(reference);
    } else {
      for (var i = 0; i < url.length; i++) {
        const reference = await getRefByUrl(url[i]);
        await deleteObject(reference);
      }
    }
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

const getRefByUrl = url => {
  const httpsReference = ref(storage, url);
  console.log(httpsReference, 'referencia de url en firebase');
  return httpsReference;
};

const analyze = async (newImgs, oldImgs) => {
  const delet = oldImgs.filter(e => !newImgs.some(a => a === e));
  if (delet.length) await deleteFile(delet);
  return [
    newImgs.filter(e => typeof e === 'object'),
    newImgs.filter(e => typeof e === 'string')
  ];
};

const uploadFile = async (file, folder) => {
  const storageRef = ref(storage, folder, `${nanoid()}`);

  return uploadBytes(storageRef, file)
    .then(snapshot => {
      console.log(snapshot, 'paso la carga del archivo');
      return getDownloadURL(snapshot.ref);
    })
    .catch(error => {
      console.error(error);
      return false;
    });
};

const reference = async (url, folder) => {
  if (typeof url === 'string') return await getRefByUrl(url);
  return await ref(storage, folder + nanoid());
};

const uploadBase64 = async (data, folder = 'logosRef', urls = null) => {
  const [newData, oldData] = Array.isArray(urls)
    ? await analyze(data, urls)
    : [data, []];

  data = newData;
  const images = [];

  if (typeof data === 'string') return [data];

  if (typeof data[0] === 'string') return data;

  try {
    for (var i = 0; i < data.length; i++) {
      const ref = await reference(urls, folder);
      const url = await uploadString(ref, data[i].base64, 'data_url');
      images.push(await getDownloadURL(url.ref));
    }
    return [...images, ...oldData];
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = { deleteFile, uploadBase64, uploadFile };
