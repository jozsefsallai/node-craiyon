import ClientV2, {
  CraiyonGenerateRequestOptions as CraiyonGenerateRequestOptionsV2,
} from './api/clientv2';
import ClientV1, {
  CraiyonGenerateRequestOptions as CraiyonGenerateRequestOptionsV1,
} from './api/clientv1';

import CraiyonOutput from './models/CraiyonOutput';
import CraiyonImage from './models/CraiyonImage';

const Client = ClientV2;

export {
  Client,
  ClientV1,
  ClientV2,
  CraiyonOutput,
  CraiyonImage,
  CraiyonGenerateRequestOptionsV2 as CraiyonGenerateRequestOptions,
  CraiyonGenerateRequestOptionsV1,
  CraiyonGenerateRequestOptionsV2,
};
