import chainAssets from "../l2/tvl";
import { sendMessage } from "./utils/discord";
import { withTimeout } from "./utils/shared/withTimeout";
import setEnvSecrets from "./utils/shared/setEnvSecrets";
import { storeR2JSONString } from "./utils/r2";
import { getCurrentUnixTimestamp } from "./utils/date";

async function getChainAssets() {
  const res: any = await chainAssets();
  res.timestamp = getCurrentUnixTimestamp();
  res.avalanche = res.avax;
  await storeR2JSONString("chainAssets", JSON.stringify(res));
  console.log("chain assets stored");
  process.exit();
}
export async function handler() {
  try {
    await setEnvSecrets();
    await withTimeout(8400000, getChainAssets()); // 140 mins
  } catch (e) {
    process.env.CHAIN_ASSET_WEBHOOK ? await sendMessage(`${e}`, process.env.CHAIN_ASSET_WEBHOOK!) : console.log(e);
    process.exit();
  }
}

handler(); // ts-node defi/src/storeChainAssets.ts
