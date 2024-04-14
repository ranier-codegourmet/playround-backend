import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import {
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';

import { RepositoryInventorySort } from './inventory.interface';
import { Inventory, InventoryDocument } from './inventory.schema';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
  ) {}

  async findOneAndUpdate(
    filter: FilterQuery<Inventory>,
    update: UpdateQuery<Inventory>,
    options: QueryOptions<Inventory>,
  ): Promise<Inventory> {
    return this.inventoryModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      ...options,
    });
  }

  async findOne(
    filter: FilterQuery<Inventory>,
    projection?: ProjectionType<Inventory>,
    options?: QueryOptions<Inventory>,
  ): Promise<Inventory | null> {
    return this.inventoryModel.findOne(filter, projection, options);
  }

  async find(
    filter: FilterQuery<Inventory>,
    projection?: ProjectionType<Inventory>,
    options?: QueryOptions<Inventory>,
  ): Promise<Inventory[] | null> {
    return this.inventoryModel.find(filter, projection, options);
  }

  async findById(
    id: string,
    projection?: ProjectionType<Inventory>,
    options?: QueryOptions<Inventory>,
  ): Promise<Inventory | null> {
    return this.inventoryModel.findById(id, projection, options);
  }

  async grid(
    organization: string,
    sorts: RepositoryInventorySort,
    page?: number,
    limit?: number,
    searchTerms?: string,
  ): Promise<{
    data: Inventory[];
    totalCount: number;
  }> {
    const facets: Record<string, PipelineStage.FacetPipelineStage[]> = {
      data: [
        {
          $lookup: {
            from: 'warehouses',
            let: {
              inventoryId: '$_id',
            },
            pipeline: [
              {
                $unwind: '$items',
              },
              {
                $match: {
                  $expr: {
                    $eq: ['$items.id', '$$inventoryId'],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
            as: 'warehouses',
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

    facets.data.push(
      {
        $project: {
          __v: 0,
          result: 0,
        },
      },
      {
        $project: {
          name: 1,
          sku: 1,
          description: 1,
          barcode: 1,
          brand: 1,
          model: 1,
          color: 1,
          weight: 1,
          dimension: 1,
          organization: 1,
          price: {
            $toString: '$price',
          },
          warehouses: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    );

    const grid = await this.inventoryModel.aggregate([
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

  async updateMany(
    filter: FilterQuery<Inventory>,
    update: UpdateQuery<Inventory>,
  ): Promise<UpdateWriteOpResult> {
    return this.inventoryModel.updateMany(filter, update, {
      new: true,
    });
  }
}
