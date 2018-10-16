import esClient from '../helpers/elasticsearch.helper';
import Itask from './task.interface';

export default class TaskService {
  /**
   * Returns the requested result from elasticsearch.
   * @param {string} value The value to search.
   * @param {string?} field The field to search by, defaults to '_id'.
   */
  public static getByField(value: string, field?: string) {
    const searchField = field || '_id';
    return TaskService.client.search<Itask>({
      index: TaskService.index,
      q: searchField + ':' + value,
    });
  }

  /**
   * Returns the count of tasks per interval as given by a given field in given time range.
   * @param {string} field The field to search by, must be a Date field.
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {string?} interval The interval as DurationString, defaults to '1d'.
   */
  public static getFieldCountPerInterval(
    field: string,
    from: number,
    to: number,
    interval?: string
  ) {
    return TaskService.client.search<Itask>({
      index: TaskService.index,
      body: {
        aggs: {
          1: {
            date_histogram: {
              field,
              interval: interval || '1d',
              time_zone: 'Asia/Jerusalem',
              min_doc_count: 1,
            },
          },
        },
        size: 0,
        _source: {
          excludes: [],
        },
        stored_fields: ['*'],
        script_fields: {},
        docvalue_fields: [
          'assignUpdates.created',
          'assignUpdates.updated',
          'comments.created',
          'comments.updated',
          'created',
          'due',
          'statusUpdates.created',
          'statusUpdates.updated',
          'updated',
        ],
        query: {
          bool: {
            must: [
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [
              {
                match_all: {},
              },
            ],
            should: [],
            must_not: [],
          },
        },
      },
    });
  }

  /**
   * Returns the count of tasks per status in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   */
  public static getCountByStatus(from: number, to: number) {
    return TaskService.client.search({
      index: TaskService.index,
      body: {
        aggs: {
          1: {
            terms: {
              field: 'status.keyword',
              size: 10,
              order: {
                _count: 'desc',
              },
            },
          },
        },
        size: 0,
        _source: {
          excludes: [],
        },
        stored_fields: ['*'],
        script_fields: {},
        docvalue_fields: [
          'assignUpdates.created',
          'assignUpdates.updated',
          'comments.created',
          'comments.updated',
          'created',
          'due',
          'statusUpdates.created',
          'statusUpdates.updated',
          'updated',
        ],
        query: {
          bool: {
            must: [
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [
              {
                match_all: {},
              },
            ],
            should: [],
            must_not: [],
          },
        },
      },
    });
  }

  /**
   * Returns the count of unique tags in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {number?} size The number of tags, defaults to 40.
   */
  public static getTagCloud(from: number, to: number, size?: number) {
    return TaskService.client.search({
      index: TaskService.index,
      body: {
        aggs: {
          1: {
            terms: {
              field: 'tags.keyword',
              size: size || 40,
              order: {
                _count: 'desc',
              },
            },
          },
        },
        size: 0,
        _source: {
          excludes: [],
        },
        stored_fields: ['*'],
        script_fields: {},
        docvalue_fields: [
          'assignUpdates.created',
          'assignUpdates.updated',
          'comments.created',
          'comments.updated',
          'created',
          'due',
          'statusUpdates.created',
          'statusUpdates.updated',
          'updated',
        ],
        query: {
          bool: {
            must: [
              {
                match_all: {},
              },
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [],
            should: [],
            must_not: [],
          },
        },
      },
    });
  }

  /**
   * Returns the first {size} users ordered by completed tasks in a given time range.
   *
   * @param {number} from Date to search from in epoch_millis.
   * @param {number} to Date to search to in epoch_millis.
   * @param {number?} size The number of tags, defaults to 10.
   */
  public static getLeaderboard(from: number, to: number, size?: number) {
    return TaskService.client.search({
      index: TaskService.index,
      body: {
        query: {
          bool: {
            must: [
              {
                terms: {
                  'status.keyword': ['done'],
                },
              },
              {
                range: {
                  created: {
                    gte: from,
                    lte: to,
                    format: 'epoch_millis',
                  },
                },
              },
            ],
            filter: [],
            should: [],
            must_not: [],
          },
        },
        aggregations: {
          1: {
            terms: {
              field: 'assign.id.keyword',
              size: size || 10,
              order: {
                _count: 'desc',
              },
            },
          },
        },
      },
    });
  }

  private static client = esClient.getClient();
  private static index = 'tasks_test';
}
