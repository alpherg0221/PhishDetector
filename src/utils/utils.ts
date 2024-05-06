export const getSendInfo: () => Promise<boolean> = async () => {
  const sendInfo: boolean | undefined = await chrome.storage.local.get(["sendInfo"]).then(res => res.sendInfo);
  if (sendInfo === undefined) {
    return false;
  } else {
    return sendInfo;
  }
}

export const setSendInfo = async (value: boolean) => {
  await chrome.storage.local.set({ sendInfo: value })
}