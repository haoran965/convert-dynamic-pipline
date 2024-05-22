import type { VocanaSDK } from "@oomol/oocana-sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ in: unknown }>;
type Outputs = Readonly<{ out: unknown }>;

const token = "?";

async function delay(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time)
    })
}

async function getConvertProgress(taskId: string) {
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
            return getConvertProgress(taskId)
        } else {
            return data;
        }
    } catch {
        await delay(1000)
        return getConvertProgress(taskId)
    }

}

async function createDynamicConvert(resource: string) {
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
    // void context.output(inputs, "out", true);
    createDynamicConvert(inputs.in as string).then(async res => {
      const data = await res.json();
      const { uuid, type, status } = data;
      const task = await getConvertProgress(uuid);
      void context.output({...task, uuid}, "out", true);

    }).catch(e => {

      throw e
    }).finally(() => {
      void context.output(inputs, "out", true);
    })

};