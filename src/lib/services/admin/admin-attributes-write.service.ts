import { createAttribute, updateAttributeTranslation } from './admin-attributes-write/attribute-operations';
import { addAttributeValue, updateAttributeValue } from './admin-attributes-write/value-operations';

/**
 * Service for admin attribute write operations
 */
class AdminAttributesWriteService {
  async createAttribute(data: {
    name?: string;
    key?: string;
    type?: string;
    filterable?: boolean;
    locale?: string;
    translations?: Array<{ locale: string; name: string }>;
  }) {
    return createAttribute(data);
  }

  async updateAttributeTranslation(
    attributeId: string,
    data: {
      name?: string;
      locale?: string;
      translations?: Array<{ locale: string; name: string }>;
    },
  ) {
    return updateAttributeTranslation(attributeId, data);
  }

  async addAttributeValue(
    attributeId: string,
    data: {
      label?: string;
      locale?: string;
      translations?: Array<{ locale: string; label: string }>;
    },
  ) {
    return addAttributeValue(attributeId, data);
  }

  async updateAttributeValue(
    attributeId: string,
    valueId: string,
    data: {
      label?: string;
      colors?: string[];
      imageUrl?: string | null;
      locale?: string;
      translations?: Array<{ locale: string; label: string }>;
    },
  ) {
    return updateAttributeValue(attributeId, valueId, data);
  }
}

export const adminAttributesWriteService = new AdminAttributesWriteService();
