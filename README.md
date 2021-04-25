# MurAll Museum

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
    * [fetchToken(id, [options])](#fetchtokenid-options)
    * [fetchMetadata(id, [options])](#fetchmetadataid-options)
    * [fetchMaxTokenId(isLayer2)](#fetchmaxtokenidislayer2)
    * [applyStateChanges(from, to, [options])](#applystatechangesfrom-to-options)
- [Examples](#examples)
- [Feedback](#feedback)

## Introduction

Fetch images drawn on MurAll and the token metadata

## Installation
```
npm install @murall/museum
```

*Requirements*
* [Node.js](https://nodejs.org/en/) version 6+ ([Canvas](https://www.npmjs.com/package/canvas) requirement)

## Usage
To interact with the blockchains, you need to have RPC provider URLs and have them as environment variables.
If you want to query Layer 1, you only need the RPC URL for Layer 1 and same for Layer 2. Both can be set too.

`PROVIDER_URL` - Provider URL for Layer 1 (Ethereum). You can sign up for one with [Infura](https://infura.io/)
`PROVIDER_URL_L2` - Provider URL for Layer 2 (Matic/Polygon). You can use the URLs from [Matic](https://docs.matic.network/docs/develop/network-details/network/)

### fetchToken(id, [options])
Gets token image and metadata

`id` - Token ID
`options`:
* `isLayer2` - *Optional* - Either `true` or `false` to specify whether to interact with Ethereum or Polygon. Defaults to `false`.
* `save` - *Optional* - If `true` also saves the PNG image and JSON metadata on your system.
* `saveDir` - *Optional* - Specify the save directory for the saved files. Only taken into account if the `save` option is `true`. Defaults to `.`
* `filename` - *Optional* - Specify the name (without a file extension) for the saved file. Only taken into account if the `save` option is `true`. Defaults to `token_${id}.png`.
* `cropped` - *Optional* - Whether the token image should be cropped (full image) or in the relative position it is on the MurAll canvas.

**Returns**
`{ canvas, [metadata]}` - Object containing the node Canvas and a JSON metadata object, if metadata was also required.


### fetchMetadata(id, [options])
Gets token metadata

`id` - Token ID
`options`:
* `isLayer2` - *Optional* - Either `true` or `false` to specify whether to interact with Ethereum or Polygon. Defaults to `false`.
* `save` - *Optional* - If `true` also saves the JSON metadata on your system.
* `saveDir` - *Optional* - Specify the save directory for the saved file. Only taken into account if the `save` option is `true`. Defaults to `.`
* `filename` - *Optional* - Specify the name (without a file extension) for the saved file. Only taken into account if the `save` option is `true`. Defaults to `metadata_${id}.json`.

**Returns**
`{ name, artist, number, series, viewUrl, isFilled }` - Object containing the JSON metadata

* `name` - Name of the NFT.
* `artist` - Creator of the NFT.
* `number` - Number given to NFT by the creator.
* `series` - Series ID given to NFT by the creator.
* `viewUrl` - URL where the NFT image can be viewed.
* `isFilled` - Whether the NFT is filled or not. (If the NFT is filled, it means that the image data has been transferred from log storage to contract storage).


### fetchMaxTokenId(isLayer2)
Find out the maximum token ID value. Tokens ID are sequential (starting with 0), so the number of NFTs minted can be derived from this

`isLayer2` - *Optional* - Either `true` or `false` to specify whether to interact with Ethereum or Polygon. Defaults to `false`.

**Returns**
Maximum token ID.

### applyStateChanges(from, to, [options])
Renders the token images from the given range on a single image in their respective places. Can be used to recreate the history of MurAll.
**Large ranges may take a lot of time or even fail, depending on the RPC connection**, so to recreate the whole history you would have to call this in batches.

`from` - First token ID in the range.
`to` - Last token ID in the range.
`options`:
* `isLayer2` - *Optional* - Either `true` or `false` to specify whether to interact with Ethereum or Polygon. Defaults to `false`.
* `save` - *Optional* - If `true` also saves the JSON metadata on your system.
* `saveDir` - *Optional* - Specify the save directory for the saved file. Only taken into account if the `save` option is `true`. Defaults to `.`
* `filename` - *Optional* - Specify the name (without a file extension) for the saved file. Only taken into account if the `save` option is `true`. Defaults to `tokens_${from}-${to}.png`.
* `initialState` - *Optional* - Canvas object to act as the initial state on which token images will be loaded. If not specified, the token images will be put onto a blank canvas.

**Returns**
Canvas containing the token images. 

## Examples

1. Fetch a Layer 1 token image

`const { canvas } = await fetchToken(0)`

2. Fetch and save a Layer 1 token image

`await fetchToken(0, { save: true, saveDir: './tokenimages' })`

3. Save a cropped token image from Layer 2

`await fetchToken(0, { isLayer2: true, save: true, cropped: true })`

4. Save a range of token images onto a single canvas

`await applyStateChanges(0, 10, { save: true })`

5. Apply the token range multiple times to achieve a larger range and save the final image

```
const canvas = await applyStateChanges(0, 10)
await applyStateChanges(11, 20, { initialState: canvas, save: true })
```

## Feedback

Feel free to [file an issue](https://github.com/murall-art/museum/issues/new). Feedback is always welcome.

If there's anything you'd like to chat about, please feel free to join our [Discord](https://discord.gg/vtRGyzeFhe)!
