import mockRepository from '../repositories/mockRepository.js';

class MockService {
    async getMockUsers(count) {
        return mockRepository.generateMockUsers(count);
    }
    async getMockPets(count) {
        return mockRepository.generateMockPets(count); 
    }
    async generateAndSaveMockData(userCount, petCount) {
        return mockRepository.generateAndInsertData(userCount, petCount);
    }
}

export default new MockService();
