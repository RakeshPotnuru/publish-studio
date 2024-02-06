interface IConfig {
  container: string;
  className: string;
  containerDimensions: Dimensions;
  dimensions: Dimensions;
  view: string;
}

interface Dimensions {
  height: string;
  width: string;
}

declare module "imagekit-media-library-widget" {
  class IKMediaLibraryWidget {
    constructor(config: IConfig, callback: (payload: IPayload) => void);
    init(): void;
  }

  export = IKMediaLibraryWidget;
}
