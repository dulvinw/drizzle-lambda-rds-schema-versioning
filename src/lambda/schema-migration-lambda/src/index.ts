import {CloudFormationCustomResourceEvent, Context} from 'aws-lambda';

export const handler = async (event: CloudFormationCustomResourceEvent, context: Context) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    let responseData = {};
    let status = "SUCCESS";

    try {
        switch (event.RequestType) {
            case 'Create':
                responseData = handleCreate(event);
                break;

            case 'Update':
                responseData = handleUpdate(event);
                break;

            case 'Delete':
                responseData = handleDelete(event);
                break;
        }
    } catch (error) {
        console.error('Error:', error);
        status = "FAILED";
        responseData = {Error: error instanceof Error ? error.message : 'Unknown error'};
    }

    await sendResponse(event, context, status, responseData);
}

const handleCreate = (event: CloudFormationCustomResourceEvent) => {
    return {Message: 'Resource created'};
}

const handleUpdate = (event: CloudFormationCustomResourceEvent) => {
    return {Message: 'Resource updated'};
}

const handleDelete = (event: CloudFormationCustomResourceEvent) => {
    return {Message: 'Resource deleted'};
}

const sendResponse = async (
    event: CloudFormationCustomResourceEvent,
    context: Context,
    responseStatus: string,
    responseData: any,
) => {
    return JSON.stringify({
        Status: responseStatus,
        Reason: `See details in CloudWatch Log Stream: ${context.logStreamName}`,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: responseData,
    });
    // const parsedUrl = new URL(event.ResponseURL);
    // const options = {
    //   hostname: parsedUrl.hostname,
    //   port: 443,
    //   path: parsedUrl.pathname + parsedUrl.search,
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': '',
    //     'Content-Length': responseBody.length,
    //   },
    // };
    //
    // return new Promise((resolve, reject) => {
    //   const request = https.request(options, (response) => {
    //     console.log(`Response status code: ${response.statusCode}`);
    //     resolve(null);
    //   });
    //
    //   request.on('error', (error) => {
    //     console.error('Error sending response:', error);
    //     reject(error);
    //   });
    //
    //   request.write(responseBody);
    //   request.end();
    // });
}