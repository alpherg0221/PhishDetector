export const reportToFirenze: (
  _type: "Detect" | "FP" | "FN", data: { [p: string]: string }
) => Promise<void> = async (_type, data) => {
  if (data.detectBy === "List") return;

  const formData = new FormData();
  formData.append("type", _type);
  Object.keys(data).forEach(key => formData.append(key, data[key]));

  await fetch("https://www.az.lab.uec.ac.jp/~ywatanabe/PhishingDetector/api/info.php", {
    mode: "cors",
    method: "POST",
    body: formData,
  });
}

export const getSendInfo: () => Promise<boolean> = async () => {
  const sendInfo: boolean | undefined = await chrome.storage.local.get(["sendInfo"]).then(res => res.sendInfo);
  if (sendInfo === undefined) {
    return false;
  } else {
    return sendInfo;
  }
}

export const setSendInfo = async (value: boolean) => {
  await chrome.storage.local.set({ sendInfo: value });
}

export enum ListType {
  Allow = "Allow",
  Block = "Block",
}

export const getList: (type: ListType) => Promise<string[]> = async (type) => {
  const list: string[] | undefined = await chrome.storage.local.get([`${ type }list`]).then(res => res[`${ type }list`]);
  if (list === undefined) {
    return [];
  } else {
    return list;
  }
}

export const setList = async (type: ListType, value: string) => {
  // Setを使って値が重複しないように更新
  const currentList = await getList(type);
  const newList = [...(new Set([...currentList, value]))];
  await chrome.storage.local.set({ [`${ type }list`]: newList });
}

export const deleteList = async (type: ListType, value: string) => {
  const currentList = await getList(type);
  const newList = currentList.filter(e => e !== value);
  await chrome.storage.local.set({ [`${ type }list`]: newList });
}