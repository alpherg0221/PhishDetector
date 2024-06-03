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

export const setUseAllowList = async (value: boolean) => {
  await chrome.storage.local.set({ useAllowList: value });
}

export const getUseAllowList: () => Promise<boolean> = async () => {
  const useAllowList: boolean | undefined = await chrome.storage.local.get(["useAllowList"]).then(res => res.useAllowList);
  if (useAllowList === undefined) {
    return false;
  } else {
    return useAllowList;
  }
}

export const setUseBlockList = async (value: boolean) => {
  await chrome.storage.local.set({ useBlockList: value });
}

export const getUseBlockList: () => Promise<boolean> = async () => {
  const useBlockList: boolean | undefined = await chrome.storage.local.get(["useBlockList"]).then(res => res.useBlockList);
  if (useBlockList === undefined) {
    return false;
  } else {
    return useBlockList;
  }
}

export enum ListType {
  Allow = "Allow",
  Block = "Block",
  Tmp = "Tmp",
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

export const updateList = async (type: ListType, value: string[]) => {
  // listを置き換え
  await chrome.storage.local.set({ [`${ type }list`]: value });
}

export const deleteList = async (type: ListType, value: string) => {
  const currentList = await getList(type);
  const newList = currentList.filter(e => e !== value);
  if (newList.length === 1 && newList[0] === null) {
    await chrome.storage.local.set({ [`${ type }list`]: [] });
  } else {
    await chrome.storage.local.set({ [`${ type }list`]: newList });
  }
}