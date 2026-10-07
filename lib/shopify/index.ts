// ScentMuse demo provider. The original Vercel Shopify implementation is in upstream.ts.
import * as upstream from './upstream';
import * as demo from '../demo/catalog';
import { NextRequest, NextResponse } from 'next/server';
const local = !process.env.SHOPIFY_STORE_DOMAIN;
export const shopifyFetch = upstream.shopifyFetch;
export async function createCart() { return local ? demo.createCart() : upstream.createCart(); }
export async function getCart() { return local ? demo.getCart() : upstream.getCart(); }
export async function addToCart(lines: { merchandiseId: string; quantity: number }[]) { return local ? demo.addToCart(lines) : upstream.addToCart(lines); }
export async function removeFromCart(ids: string[]) { return local ? demo.removeFromCart(ids) : upstream.removeFromCart(ids); }
export async function updateCart(lines: { id: string; merchandiseId: string; quantity: number }[]) { return local ? demo.updateCart(lines) : upstream.updateCart(lines); }
export async function getCollection(handle: string) { return local ? demo.getCollection(handle) : upstream.getCollection(handle); }
export async function getCollectionProducts(options: {collection: string; reverse?: boolean; sortKey?: string}) { return local ? demo.getCollectionProducts(options) : upstream.getCollectionProducts(options); }
export async function getCollections() { return local ? demo.getCollections() : upstream.getCollections(); }
export async function getMenu(handle: string) { return local ? demo.getMenu(handle) : upstream.getMenu(handle); }
export async function getPage(handle: string) { return local ? demo.getPage(handle) : upstream.getPage(handle); }
export async function getPages() { return local ? demo.getPages() : upstream.getPages(); }
export async function getProduct(handle: string) { return local ? demo.getProduct(handle) : upstream.getProduct(handle); }
export async function getProducts(options: { query?: string; reverse?: boolean; sortKey?: string }) { return local ? demo.getProducts(options) : upstream.getProducts(options); }
export async function getProductRecommendations(id: string) { return local ? demo.getProductRecommendations(id) : upstream.getProductRecommendations(id); }
export async function revalidate(request: NextRequest) { return local ? NextResponse.json({demo: true}) : upstream.revalidate(request); }
