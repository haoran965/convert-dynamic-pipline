import type { VocanaSDK } from "@oomol/oocana-sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ uuid: string, netless_token: string }>;
type Outputs = Readonly<{ uuid: string, prefix: string}>;
async function delay(time: number) {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(true);
      }, time)
  })
}

async function getConvertProgress(taskId: string, token: string) {
    try {
        const res = await fetch(`https://api.netless.link/v5/projector/tasks/${taskId}`, {
            headers: {
                "Content-Type": "application/json",
                token,
            }
        });
        const data = await res.json();
        if (data.status === "Converting" || data.status === "Waiting") {
            console.log("convert progress:", data.convertedPercentage)
            await delay(3000)
            return getConvertProgress(taskId, token)
        } else {
            return data;
        }
    } catch {
        await delay(1000)
        return getConvertProgress(taskId, token)
    }

}
export default async function(inputs: Inputs, context: Context) {

  const uuid = inputs.uuid;
  const token = inputs.netless_token;
  try {
    const task = await getConvertProgress(uuid, token)
    void context.output(uuid, "uuid", true);
    void context.output(task.prefix, "prefix", true);
  } catch(error) {
    console.log(error);
  } finally {
    void context.done();
  }
};