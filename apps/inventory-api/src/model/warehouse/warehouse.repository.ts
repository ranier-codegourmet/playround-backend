import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import {
  ClientSession,
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';

import { RepositoryWarehouseSort } from './warehouse.interface';
import { Warehouse, WarehouseDocument } from './warehouse.schema';

@Injectable()
export class WarehouseRepository {
  constructor(
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async findOneAndUpdate(
    filter: FilterQuery<Warehouse>,
    update: UpdateQuery<Warehouse>,
    options?: QueryOptions<Warehouse>,
  ): Promise<Warehouse> {
    return this.warehouseModel.findOneAndUpdate(filter, update, {
      new: true,
      ...options,
    });
  }

  async findOne(
    filter: FilterQuery<Warehouse>,
    projection?: ProjectionType<Warehouse>,
    options?: QueryOptions<Warehouse>,
  ): Promise<Warehouse | null> {
    return this.warehouseModel.findOne(filter, projection, options).lean();
  }

  async find(
    filter: FilterQuery<Warehouse>,
    projection?: ProjectionType<Warehouse>,
    options?: QueryOptions<Warehouse>,
  ): Promise<Warehouse | null> {
    return this.warehouseModel.find(filter, projection, options).lean();
  }

  async findById(
    id: string,
    projection?: ProjectionType<Warehouse>,
    options?: QueryOptions<Warehouse>,
  ): Promise<Warehouse | null> {
    return this.warehouseModel.findById(id, projection, options).lean();
  }

  async grid(
    organization: string,
    sorts: RepositoryWarehouseSort,
    page?: number,
    limit?: number,
    searchTerms?: string,
  ): Promise<{
    data: Warehouse[];
    totalCount: number;
  }> {
    const facets: Record<string, PipelineStage.FacetPipelineStage[]> = {
      data: [
        {
          $addFields: {
            isItemsEmpty: { $eq: [{ $size: '$items' }, 0] },
          },
        },
        {
          $unwind: {
            path: '$items',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'inventories',
            localField: 'items.id',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
            as: 'details',
          },
        },
        {
          $unwind: {
            path: '$details',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            'items.details': '$details',
          },
        },
        {
          $group: {
            _id: { _id: '$_id', type: '$items.type' },
            root: { $mergeObjects: '$$ROOT' },
            items: { $push: '$items.details' },
            isItemsEmpty: { $first: '$isItemsEmpty' },
          },
        },
        {
          $group: {
            _id: '$_id._id',
            itemsByType: {
              $push: {
                type: '$_id.type',
                items: '$items',
              },
            },
            root: { $mergeObjects: '$$ROOT' },
            isItemsEmpty: { $first: '$isItemsEmpty' },
          },
        },
        {
          $addFields: {
            itemsByType: {
              $cond: {
                if: '$isItemsEmpty',
                then: [],
                else: '$itemsByType',
              },
            },
          },
        },
        {
          $project: {
            isItemsEmpty: 0,
            'itemsByType.items.type': 0,
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$root.root', { items: '$itemsByType' }],
            },
          },
        },
        {
          $project: {
            details: 0,
            isItemsEmpty: 0,
          },
        },
      ],
      totalCount: [
        {
          $count: 'count',
        },
      ],
    };

    if (sorts) {
      facets.data.push({
        $sort: sorts,
      });
    }

    if (page && limit) {
      facets.data.push({
        $skip: (page - 1) * limit,
      });
      facets.data.push({
        $limit: limit,
      });
    }

    facets.data.push({
      $project: {
        __v: 0,
        result: 0,
      },
    });

    const grid = await this.warehouseModel.aggregate([
      {
        $addFields: {
          result: {
            $regexMatch: {
              input: '$name',
              regex: searchTerms ?? '',
              options: 'i',
            },
          },
        },
      },
      {
        $match: {
          result: true,
          organization: new ObjectId(organization),
        },
      },
      {
        $facet: facets,
      },
      {
        $project: {
          data: 1,
          totalCount: {
            $arrayElemAt: ['$totalCount.count', 0],
          },
        },
      },
    ]);

    return {
      data: grid[0].data,
      totalCount: grid[0].totalCount,
    };
  }

  async deleteById(id: string): Promise<Warehouse | null> {
    return this.warehouseModel.findByIdAndDelete(id).lean();
  }

  async updateMany(
    filter: FilterQuery<Warehouse>,
    update: UpdateQuery<Warehouse>,
    session?: ClientSession,
  ): Promise<UpdateWriteOpResult> {
    return this.warehouseModel.updateMany(filter, update, {
      new: true,
      session,
    });
  }
}
