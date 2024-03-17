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
    options: QueryOptions<Warehouse>,
  ): Promise<Warehouse> {
    return this.warehouseModel
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        ...options,
      })
      .lean();
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
      data: [],
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
}
