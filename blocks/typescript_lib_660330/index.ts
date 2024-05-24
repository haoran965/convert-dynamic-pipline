import type { VocanaSDK } from "@oomol/oocana-sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ url: string, netless_token: string }>;
type Outputs = Readonly<{ uuid: string, prefix: string }>;

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

async function createDynamicConvert(resource: string, token: string) {
    const res = await fetch("https://api.netless.link/v5/projector/tasks", {
        method: "POST",
        body: JSON.stringify({
            resource,
            preview: true,
            type: "dynamic"
        }),
        headers: {
            token,
            // region: "us-sv",
            "Content-Type": "application/json",
        }
    })
    return res;
}

export default async function(inputs: Inputs, context: Context) {
    const token = inputs.netless_token;
    const url = inputs.url;
    createDynamicConvert(url, token).then(async res => {
      const data = await res.json();
      const { uuid, type, status } = data;
      const task = await getConvertProgress(uuid, token);
      console.log(task, "task");
      void context.output(uuid, "uuid", true);
      void context.output(task.prefix, "prefix", true);
    }).catch(e => {
      throw e
    })
};