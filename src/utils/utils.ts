export const getSendInfo = async () => {
  const sendInfo = await chrome.storage.local.get(["sendInfo"]).then(res => res.sendInfo);
  if (sendInfo == undefined) {
    return false;
  } else {
    return sendInfo;
  }
}

export const setSendInfo = async (value: boolean) => {
  await chrome.storage.local.set({ sendInfo: value })
}