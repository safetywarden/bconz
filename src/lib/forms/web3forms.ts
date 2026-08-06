const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_TIMEOUT_MS = 15000;

export type Web3FormsFieldValue = string | boolean | string[] | undefined;

export type Web3FormsPayload = {
  access_key: string;
  subject: string;
  from_name: string;
  botcheck?: string;
  [key: string]: Web3FormsFieldValue;
};

export type Web3FormsResult = {
  success: boolean;
  message: string;
};

type ProviderResponse = {
  success?: unknown;
  message?: unknown;
};

function getProviderMessage(value: unknown) {
  if (typeof value === "object" && value !== null && "message" in value) {
    const message = (value as ProviderResponse).message;
    return typeof message === "string" ? message : undefined;
  }

  return undefined;
}

async function parseProviderResponse(response: Response): Promise<ProviderResponse> {
  try {
    const data: unknown = await response.json();
    return typeof data === "object" && data !== null ? (data as ProviderResponse) : {};
  } catch {
    return {};
  }
}

export async function submitWeb3Form(
  subject: string,
  fields: Record<string, Web3FormsFieldValue>
): Promise<Web3FormsResult> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return {
      success: false,
      message: "Submission service is not configured. Please try again later.",
    };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), WEB3FORMS_TIMEOUT_MS);

  try {
    const payload: Web3FormsPayload = {
      ...fields,
      access_key: accessKey,
      subject,
      from_name: "BCONZ Website",
    };

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await parseProviderResponse(response);

    if (!response.ok || data.success !== true) {
      return {
        success: false,
        message: "Unable to submit your enquiry. Please try again.",
      };
    }

    return {
      success: true,
      message: getProviderMessage(data) ?? "Submission received.",
    };
  } catch {
    return {
      success: false,
      message: "Unable to submit your enquiry. Please try again.",
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
